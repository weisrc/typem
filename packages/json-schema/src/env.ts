import type { Env, GeneralType, SpecialType } from "typem/macro";
import type { JsonSchema, JsonSchemaMacro } from ".";
export * from "./annotations-env";

export function entry(t: JsonSchema) {
  return (() => t) as JsonSchemaMacro;
}

export function error(message: string): JsonSchema {
  throw new Error(message);
}

export function general(type: GeneralType): JsonSchema {
  return () => ({ type });
}

export function special(_type: SpecialType): JsonSchema {
  throw new Error("cannot create schema for special types");
}

export function literal(value: any): JsonSchema {
  return () => ({ const: value });
}

export function object<T extends object>(
  shape: {
    [key in keyof T]: JsonSchema;
  },
  required: string[]
): JsonSchema {
  return () => ({
    type: "object",
    properties: Object.fromEntries(
      Object.entries<JsonSchema>(shape).map(([key, value]) => [key, value()])
    ),
    required,
  });
}

export function array(type: JsonSchema): JsonSchema {
  return () => ({
    type: "array",
    items: type(),
  });
}

export function union(types: JsonSchema[]): JsonSchema {
  return () => ({
    oneOf: types.map((type) => type()),
  });
}

export function discriminatedUnion(
  _path: string,
  _values: JsonSchema[],
  types: JsonSchema[]
): JsonSchema {
  return union(types);
}

export function intersection(types: JsonSchema[]): JsonSchema {
  return () => ({
    allOf: types.map((type) => type()),
  });
}

export function recursive(fn: (self: JsonSchema) => JsonSchema): JsonSchema {
  return () => ({
    $id: "recursive",
    ...fn(() => ({ $ref: "recursive" }))(),
  });
}

export function tuple(...types: JsonSchema[]): JsonSchema {
  return () => ({
    type: "array",
    prefixItems: types.map((type) => type()),
    items: false,
  });
}

export function callable(): JsonSchema {
  throw new Error("cannot create schema for callable types");
}

export function record(key: JsonSchema, value: JsonSchema): JsonSchema {
  return () => ({
    type: "object",
    patternProperties: {
      [key()]: value(),
    },
  });
}

export const env: Env<JsonSchemaMacro, JsonSchema> = {
  entry,
  error,
  array,
  general,
  record,
  intersection,
  literal,
  object,
  recursive,
  special,
  union,
  discriminatedUnion,
  tuple,
  callable,
};
