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
  const { type: unwrappedOutput, optional } = unwrapOptional(output);

  const outputSchema = unwrappedOutput.schema();

  const operationSchema: OperationSchema = {};

  if (outputSchema) {
    operationSchema.responses ??= {};
    operationSchema.responses["200"] = {
      description: "OK",
      content: {
        "application/json": {
          schema: outputSchema,
        },
      },
    };
  }

  if (optional) {
    operationSchema.responses ??= {};
    operationSchema.responses["404"] = {
      description: "Not Found",
    };
  }

  const predicateExtractors: PredicateExtractor[] = [];

  for (const input of inputs) {
    const {
      type: { fromInput, predicate, schema },
      optional,
    } = unwrapOptional(input);

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

function unwrapOptional(type: Merged<any>): {
  type: Merged<any>;
  optional: boolean;
} {
  if (type.inner?.mode !== "optional") {
    return { type, optional: false };
  }

  return { type: type.inner.types[0], optional: true };
}
