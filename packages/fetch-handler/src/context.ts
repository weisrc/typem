import type { FromInput } from "typem";
import { HttpError, UndefinedOutputError } from "./errors";
import { type ErrorHandler, type Extractor, type OutputHandler } from "./types";

const extractors: Record<string, Extractor<any>> = {};

export let errorHandler: ErrorHandler = (error) => {
  if (error instanceof HttpError) {
    return error.toResponse();
  }

  throw error;
};

export let outputHandler: OutputHandler = (output) => {
  if (output === undefined) {
    throw new UndefinedOutputError();
  }

  if (output instanceof Response) {
    return output;
  }

  if (output instanceof ArrayBuffer) {
    return new Response(output, {
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });
  }

  return Response.json(output);
};

export function setErrorHandler(handler: ErrorHandler): void {
  errorHandler = handler;
}

export function setOutputHandler(handler: OutputHandler): void {
  outputHandler = handler;
}

export function registerExtractor(
  extractor: Extractor<FromInput<string, any>>
): void {
  const id = extractor.id;
  if (extractors[id]) {
    throw new Error(`Extractor ${id} already registered`);
  }
  extractors[id] = extractor;
}

export function getExtractor(id: string): Extractor<FromInput<string, any>> {
  const extractor = extractors[id];
  if (!extractor) {
    throw new Error(`Extractor ${id} not found`);
  }
  return extractor;
}

export function unregisterExtractor(
  extractor: Extractor<FromInput<string, any>>
): void {
  const id = extractor.id;
  if (!extractors[id]) {
    throw new Error(`Extractor ${id} not registered`);
  }
  delete extractors[id];
}
