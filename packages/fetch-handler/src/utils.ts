import { withErrors, type Predicate } from "@typem/predicate";
import { getExtractor } from "./context";
import type { Extractor, Merged, OperationSchema } from "./types";

export function mapObjectValues<
  T extends Record<string, any>,
  U extends Record<string, any>
>(obj: T, mapFn: (value: T[keyof T], key: keyof T) => U[keyof U]): U {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, mapFn(value, key)])
  ) as U;
}

export type PredicateExtractor = {
  predicate: Predicate<any>;
  extractor: Extractor<any>;
  param: any;
  optional: boolean;
};

export function getPredicateExtractorsWithSchema(
  inputs: Merged<any>[],
  output: Merged<any>
) {
  const outputSchema = output.schema();

  const operationSchema: OperationSchema = !outputSchema
    ? {}
    : {
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: output.schema(),
              },
            },
          },
        },
      };

  const predicateExtractors: PredicateExtractor[] = [];

  for (const input of inputs) {
    const [{ fromInput, predicate, schema }, optional] = getNonNull(input);

    if (!fromInput) {
      throw new Error("fromInput is missing");
    }

    const [id, param] = fromInput;

    const extractor = getExtractor(id);

    predicateExtractors.push({
      predicate: predicate
        ? withErrors(predicate)
        : (((_) => true) as Predicate<any>),
      extractor,
      param,
      optional,
    });

    extractor.updateSchema(operationSchema, param, schema());
  }

  return { predicateExtractors, operationSchema };
}

function getNonNull(type: Merged<any>): [Merged<any>, boolean] {
  if (type.inner?.mode !== "union") {
    return [type, false];
  }

  const filtered = type.inner.types.filter((type) => !type.isUndefined);
  if (filtered.length === 0) {
    throw new Error("No non-null types found");
  }
  if (filtered.length > 1) {
    throw new Error("Multiple non-null types found");
  }

  return [filtered[0], true];
}
