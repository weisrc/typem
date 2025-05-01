import type { JsonSchema } from "@typem/json-schema";
import type { Predicate } from "@typem/predicate";

import type { OpenAPIV3_1 } from "openapi-types";
import {
  type FromHeader,
  type FromQuery,
  type FromBody,
  type FromInput,
  type FromParam,
  type Builtin,
  type FromRequest,
} from "typem";
import { macro } from "typem/macro";
import { registerExtractor } from "./context";

export type RequestWithParams = Request & {
  params?: Record<string, string>;
} & Builtin<"request"> &
  FromRequest;

export type Merged<T> = {
  types?: Merged<any>[];
  fromInput?: [string, any];
  predicate: Predicate<T>;
  schema: JsonSchema<T>;
};

export type OperationSchema = OpenAPIV3_1.OperationObject;

export type OperationSchemaUpdater = (doc: OperationSchema) => void;

export type FetchHandler<
  _Parameters extends FromInput<string, any>[] = FromInput<string, any>[],
  _ReturnType = any
> = {
  (input: RequestWithParams): Response;
  schema: OperationSchema;
};

export type FetchHandlerMacro = <
  Parameters extends FromInput<string, any>[],
  ReturnType
>(
  fn: (...args: Parameters) => ReturnType
) => FetchHandler<Parameters, ReturnType>;

export const handler = macro<
  FetchHandlerMacro,
  "@typem/fetch-handler/env"
>();

export function bootstrap() {
  registerExtractor<FromParam<string>>(
    "fromParam",
    (ctx, name) => {
      return ctx.params?.[name];
    },
    (docs, name, schema) => {
      docs.parameters = [
        ...(docs.parameters ?? []),
        {
          in: "path",
          name,
          schema,
          required: true,
        },
      ];
    }
  );

  registerExtractor<FromQuery<string>>(
    "fromQuery",
    (req, name) => {
      const url = new URL(req.url);
      return url.searchParams.get(name);
    },
    (docs, name, schema) => {
      docs.parameters = [
        ...(docs.parameters ?? []),
        {
          in: "query",
          name,
          schema,
        },
      ];
    }
  );

  registerExtractor<FromHeader<string>>(
    "fromHeader",
    (ctx, name) => {
      return ctx.headers.get(name);
    },
    (docs, name, schema) => {
      docs.parameters = [
        ...(docs.parameters ?? []),
        {
          in: "header",
          name,
          schema,
        },
      ];
    }
  );

  registerExtractor<FromBody<string>>(
    "fromBody",
    (req, name) => {
      return req.json().then((json) => json[name]);
    },
    (docs, name, schema) => {
      docs.requestBody = {
        content: {
          "application/json": {
            schema,
          },
        },
      };
    }
  );

  registerExtractor<FromRequest>("fromRequest", (req) => {
    return req;
  });
}
