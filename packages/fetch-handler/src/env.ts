import type { AnnotationHandler } from "typem/macro";
import type { FromInput } from "typem";
import type {
  DocsUpdater,
  FetchHandlerDescriptor,
  FetchHandlerMacro,
  Merged,
  RequestWithParams,
} from ".";
import { context, type Extractor, type ExtractorDocsUpdater } from "./context";
import { getErrors, withErrors, type Predicate } from "@typem/predicate";
import type { OpenAPIV3_1 } from "openapi-types";

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

export const requestContext = () => {
  return {};
};

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

  if (!inputTypes) {
    throw new Error("input types is missing");
  }

  return (fn: (...args: any) => any) => {
    const predicateExtractors: PredicateExtractor[] = [];
    const updaters: DocsUpdater[] = [];

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
      const updater = context.docsUpdaters[id];
      if (updater) {
        updaters.push((docs) => updater(docs, param, schema()));
      }
      predicateExtractors.push({
        predicate: predicate
          ? withErrors(predicate)
          : (((_) => true) as Predicate<any>),
        extractor,
        param,
      });
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
      const result = fn(...predicateExtractors);
      return result;
    }

    function docsUpdater(docs: OpenAPIV3_1.OperationObject) {
      for (const updater of updaters) {
        updater(docs);
      }

      docs.responses = docs.responses ?? {};
      docs.responses[200] = {
        description: "",
        content: {
          "application/json": {
            schema: output.schema(),
          },
        },
      };
    }

    const descriptor: FetchHandlerDescriptor = {
      handler,
      docsUpdater,
    };

    return descriptor;
  };
}
