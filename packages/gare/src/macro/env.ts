import type { TagHandler } from "type-macro";
import type {
  FromRequest,
  Handler,
  HandlerFunction,
  HandlerMacro,
  Merged,
} from ".";
import { fromRequestHandlers } from "./context";

export * from "./merged-env";

export function callable(
  _: Merged<any>,
  signatures: [FromRequestExtractor<any>[], Merged<any>][]
): [FromRequestExtractor<any>[], Merged<any>] {
  if (!signatures.length) {
    throw new Error("No signatures provided");
  }
  if (signatures.length > 1) {
    throw new Error("Multiple signatures provided");
  }

  return signatures[0];
}

type FromRequestExtractor<T> = (request: Request) => T;

export const fromRequest: TagHandler<
  FromRequest<string, any>,
  Merged<any>,
  FromRequestExtractor<any>
> = (inner, [id, param]) => {
  return (request: Request) => {
    const handler = fromRequestHandlers[id];

    if (!handler) {
      throw new Error(`Extractor ${id} not found`);
    }

    const out = handler(request, param);
    if (inner.is(out)) {
      return out;
    }
    throw new Error(`validation failed for ${id}`);
  };
};

export function error(message: string) {
  throw new Error(message);
}

export function entry(
  signature: [FromRequestExtractor<any>[], Merged<any>]
): HandlerMacro {
  return (fn: HandlerFunction) => {
    const [extractors, returnType] = signature;

    function run(request: Request) {
      const args = extractors.map((extractor) => extractor(request));
      const result = fn(...args);
      return result;
    }

    const handler: Handler<HandlerFunction> = {
      run: run,
      schema: false,
    };

    return handler;
  };
}
