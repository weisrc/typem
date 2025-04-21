import type { JsonSchema } from "@typem/json-schema";
import type { Predicate } from "@typem/predicate";

import type { OpenAPIV3_1 } from "openapi-types";
import type { FromInput, FromParam } from "typem";
import { macro } from "typem/macro";
import { registerExtractor } from "./context";

export type RequestContext = {
  request: Request;
  params: Record<string, string>;
} & Record<string, any>;

export type Merged<T> = {
  types?: Merged<any>[];
  fromInput?: [string, any];
  predicate: Predicate<T>;
  schema: JsonSchema<T>;
};

export type DocsUpdater = (docs: OpenAPIV3_1.OperationObject) => void;

export type FetchHandlerDescriptor<
  _Parameters extends FromInput<string, any>[] = FromInput<string, any>[],
  _ReturnType = any
> = {
  handler: (input: RequestContext) => Response;
  docsUpdater: DocsUpdater;
};

export type FetchHandlerMacro = <
  Parameters extends FromInput<string, any>[],
  ReturnType
>(
  fn: (...args: Parameters) => ReturnType
) => FetchHandlerDescriptor<Parameters, ReturnType>;

export const fetchHandler = macro<
  FetchHandlerMacro,
  "@typem/fetch-handler/env"
>();

export function bootstrap() {
  registerExtractor<FromParam<string>>(
    "fromParam",
    (ctx, name) => {
      return ctx.params[name];
    },
    (docs, name, schema) => {
      docs.parameters = [
        ...(docs.parameters ?? []),
        {
          in: "path",
          name,
          schema,
        },
      ];
    }
  );
}
