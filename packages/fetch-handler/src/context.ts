import type { FromInput } from "typem";
import type { Extractor } from "./types";

export type Context = {
  extractors: Record<string, Extractor<any>>;
};

export const context: Context = {
  extractors: {},
};

export function registerExtractor(
  extractor: Extractor<FromInput<string, any>>
): void {
  const id = extractor.id;
  if (context.extractors[id]) {
    throw new Error(`Extractor ${id} already registered`);
  }
  context.extractors[id] = extractor;
}

export function getExtractor(id: string): Extractor<FromInput<string, any>> {
  const extractor = context.extractors[id];
  if (!extractor) {
    throw new Error(`Extractor ${id} not found`);
  }
  return extractor;
}

export function unregisterExtractor(
  extractor: Extractor<FromInput<string, any>>
): void {
  const id = extractor.id;
  if (!context.extractors[id]) {
    throw new Error(`Extractor ${id} not registered`);
  }
  delete context.extractors[id];
}
