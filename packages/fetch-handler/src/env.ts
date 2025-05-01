import type { AnnotationHandler } from "typem/macro";
import type { FromInput } from "typem";
import type {
  FetchHandlerMacro,
  Merged,
  RequestWithParams,
  OperationSchema,
  FetchHandler,
} from ".";
import { context, type Extractor, type ExtractorDocsUpdater } from "./context";
import { getErrors, withErrors, type Predicate } from "@typem/predicate";

export * from "./merged-env";

export const fromInput: AnnotationHandler<
  FromInput<string, any>,
  Merged<any>
> = (inner, fromInput) => {
  return {
    ...inner,
    fromInput,
  };
};

export function request() {
  return {};
}

export function error(message: string) {
  throw new Error(message);
}

export function entry(
  inputs: Merged<any>,
  output: Merged<any>
): FetchHandlerMacro {
  type PredicateExtractor = {
    predicate: Predicate<any>;
    extractor: Extractor<any>;
    param: any;
  };

  const inputTypes = inputs.types;

  const operationSchema: OperationSchema = {
    responses: {
      200: {
        description: "",
        content: {
          "application/json": {
            schema: output.schema(),
          },
        },
      },
    },
  };

  if (!inputTypes) {
    throw new Error("input types is missing");
  }

  return (fn: (...args: any) => any) => {
    const predicateExtractors: PredicateExtractor[] = [];

    for (const input of inputTypes) {
      const { fromInput, predicate, schema } = input;

      if (!fromInput) {
        throw new Error("fromInput is missing");
      }
      const [id, param] = fromInput;
      const extractor = context.extractors[id];
      if (!extractor) {
        throw new Error(`Extractor ${id} not found`);
      }

      predicateExtractors.push({
        predicate: predicate
          ? withErrors(predicate)
          : (((_) => true) as Predicate<any>),
        extractor,
        param,
      });

      const updater = context.docsUpdaters[id];
      if (updater) {
        updater(operationSchema, param, schema());
      }
    }

    function handler(ctx: RequestWithParams) {
      const args: any[] = [];
      for (const { predicate, extractor, param } of predicateExtractors) {
        const value = extractor(ctx, param);
        if (!predicate(value)) {
          return getErrors();
        }
        args.push(value);
      }

      return fn(...args);
    }

    return Object.assign(handler, {
      schema: operationSchema,
    }) as FetchHandler;
  };
}
