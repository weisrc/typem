import type { OpenAPIV3_1 } from "openapi-types";
import type { FromInput } from "typem";
import type { RequestContext } from ".";

export type Extractor<T> = (request: RequestContext, param: T) => any;

export type ExtractorDocsUpdater = (
  docs: OpenAPIV3_1.OperationObject,
  param: any,
  schema: any
) => void;

export type Context = {
  extractors: Record<string, Extractor<any>>;
  docsUpdaters: Record<string, ExtractorDocsUpdater>;
};

export const context: Context = {
  extractors: {},
  docsUpdaters: {},
};

export function registerExtractor<T extends FromInput<string, any>>(
  name: T extends FromInput<infer N, any> ? N : never,
  extractor: Extractor<T extends FromInput<any, infer P> ? P : never>,
  schemaUpdater?: ExtractorDocsUpdater
): void {
  if (context.extractors[name]) {
    throw new Error(`Extractor ${name} already registered`);
  }
  context.extractors[name] = extractor;
  if (schemaUpdater) {
    context.docsUpdaters[name] = schemaUpdater;
  }
}
