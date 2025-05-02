import type { JsonSchema } from "@typem/json-schema";
import type { Predicate } from "@typem/predicate";

import type { OpenAPIV3_1 } from "openapi-types";
import { type Builtin, type FromInput, type FromRequest } from "typem";

export type HandlerRequest = Request & {
  params?: Record<string, string>;
  urlObject?: URL;
} & Builtin<"unit"> &
  FromRequest;

export class Reply extends Response implements Builtin<"unit"> {
  __annotation?: {
    builtin: "unit";
  };
}

export type Merged<T> = {
  isUndefined?: boolean;
  fromInput?: [string, any];
  predicate: Predicate<T>;
  schema: JsonSchema<T>;
  inner?: {
    mode: "union" | "intersection" | "tuple";
    types: Merged<any>[];
  };
};

export type OperationSchema = OpenAPIV3_1.OperationObject;

export type OperationSchemaUpdater = (schema: OperationSchema) => void;

export type FetchHandler<
  _Parameters extends (FromInput<string, any> | undefined)[],
  _ReturnType
> = {
  (input: HandlerRequest): Promise<Response>;
  schema: OperationSchema;
};

export type FetchHandlerMacro = <
  Parameters extends (FromInput<string, any> | undefined)[],
  ReturnType
>(
  fn: (...args: Parameters) => Promise<ReturnType> | ReturnType
) => FetchHandler<Parameters, ReturnType>;

export type Extractor<T extends FromInput<string, any>> = {
  readonly id: GetFromInputId<T>;
  extract(request: HandlerRequest, param: GetFromInputParam<T>): any;
  updateSchema(
    operationSchema: OperationSchema,
    param: GetFromInputParam<T>,
    dataSchema: any
  ): void;
};

type GetFromInputParam<T> = T extends FromInput<string, infer P> ? P : never;
type GetFromInputId<T> = T extends FromInput<infer Id, any> ? Id : never;
