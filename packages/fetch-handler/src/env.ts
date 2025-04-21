import type { AnnotationHandler } from "typem/macro";
import type { FromInput } from "typem";
import type {
  DocsUpdater,
  FetchHandlerDescriptor,
  FetchHandlerMacro,
  Merged,
  RequestContext,
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

export function error(message: string) {
  throw new Error(message);
}

export function entry(
  inputs: Merged<any>,
  output: Merged<any>
): FetchHandlerMacro {
  const inputTypes = inputs.types;

  if (!inputTypes) {
    throw new Error("input types is missing");
  }

  return (fn: (...args: any) => any) => {
    const predicates: Predicate<any>[] = [];
    const extractors: Extractor<any>[] = [];
    const updaters: DocsUpdater[] = [];
    const params: any[] = [];

    for (const input of inputTypes) {
      const { fromInput, predicate, schema } = input;

      predicates.push(withErrors(predicate));

      if (!fromInput) {
        throw new Error("fromInput is missing");
      }
      const [id, param] = fromInput;
      const extractor = context.extractors[id];
      if (!extractor) {
        throw new Error(`Extractor ${id} not found`);
      }
      extractors.push((ctx, param) => extractor(ctx, param));
      const updater = context.docsUpdaters[id];
      if (updater) {
        updaters.push((docs) => updater(docs, param, schema()));
      }
      params.push(param);
    }

    function handler(ctx: RequestContext) {
      const args: any[] = [];
      for (let i = 0; i < extractors.length; i++) {
        const extractor = extractors[i];
        const param = params[i];
        const predicate = predicates[i];

        const value = extractor(ctx, param);
        if (!predicate(value)) {
          return getErrors();
        }

        args.push(value);
      }
      const result = fn(...args);
      return result;
    }

    function docsUpdater(docs: any) {
      for (const updater of updaters) {
        updater(docs);
      }
    }

    const descriptor: FetchHandlerDescriptor = {
      handler,
      docsUpdater,
    };

    return descriptor;
  };
}
