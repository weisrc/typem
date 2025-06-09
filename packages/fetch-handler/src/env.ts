import { getErrors, type Predicate } from "@typem/predicate";
import type { FromInput } from "typem";
import type { AnnotationHandler } from "typem/macro";
import {
  type FetchHandler,
  type FetchHandlerMacro,
  type Merged,
  type HandlerRequest,
} from "./types";
import { getPredicateExtractorsWithSchema } from "./utils";
import { ExtractorValidationError, UndefinedOutputError } from "./errors";
import { errorHandler, outputHandler } from "./context";

export * from "./merged-env";

export const fromInput: AnnotationHandler<
  FromInput<string, any>,
  Merged<any>
> = (inner, fromInput) => {
  if (inner.fromInput) {
    throw new Error("cannot have two FromInput");
  }

  return {
    ...inner,
    fromInput,
  };
};

export function unit(): Merged<any> {
  return {
    predicate: (() => true) as unknown as Predicate<any>,
    schema: () => undefined,
  };
}

export function error(message: string) {
  throw new Error(message);
}

export function entry(
  input: Merged<any>,
  output: Merged<any>
): FetchHandlerMacro {
  const inner = input.inner;

  if (!inner) {
    throw new Error("input types is missing");
  }

  if (inner.mode !== "tuple") {
    throw new Error("input types is not a tuple");
  }

  return (fn: (...args: any) => any) => {
    const { predicateExtractors, operationSchema } =
      getPredicateExtractorsWithSchema(inner.types, output);

    async function getHandlerOutput(req: HandlerRequest): Promise<any> {
      const args: any[] = [];
      for (const {
        predicate,
        extractor,
        param,
        optional,
      } of predicateExtractors) {
        const value = await extractor.extract(req, param);
        if (predicate(value)) {
          args.push(value);
          continue;
        }
        if (value === undefined && optional) {
          args.push(undefined);
          continue;
        }
        throw new ExtractorValidationError(extractor.id, param, getErrors());
      }

      return await fn(...args);
    }

    async function handler(req: HandlerRequest) {
      try {
        const output = await getHandlerOutput(req);
        return outputHandler(output);
      } catch (error) {
        return errorHandler(error);
      }
    }

    return Object.assign(handler, {
      schema: operationSchema,
    }) as FetchHandler<any, any>;
  };
}
