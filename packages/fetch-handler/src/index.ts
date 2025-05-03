import { macro } from "typem/macro";
import { registerExtractor } from "./context";
import {
  jsonExtractor,
  headerExtractor,
  paramExtractor,
  queryExtractor,
  requestExtractor,
} from "./extractors";
import type { FetchHandlerMacro } from "./types";

export * from "./types";

export const handler = macro<FetchHandlerMacro, "@typem/fetch-handler/env">();

export function registerBaseExtractors() {
  registerExtractor(queryExtractor);
  registerExtractor(headerExtractor);
  registerExtractor(paramExtractor);
  registerExtractor(jsonExtractor);
  registerExtractor(requestExtractor);
}

export { unregisterExtractor, registerExtractor } from "./context";
