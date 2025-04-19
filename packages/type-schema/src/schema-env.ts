import type { Env, GeneralType, SpecialType } from "type-macro";
import type { Schema, SchemaMacro } from ".";
export * from "./schema-tags";

export function entry(t: Schema) {
  return (() => t) as SchemaMacro;
}

export function error(message: string): Schema {
  throw new Error(message);
}

export function general(type: GeneralType): Schema {
  return () => ({ type });
}

export function special(_type: SpecialType): Schema {
  throw new Error("cannot create schema for special types");
}

export function literal(value: any): Schema {
  return () => ({ const: value });
}

export function object<T extends object>(
  shape: {
    [key in keyof T]: Schema;
  },
  required: string[]
): Schema {
  return () => ({
    type: "object",
    properties: Object.fromEntries(
      Object.entries<Schema>(shape).map(([key, value]) => [key, value()])
    ),
    required,
    additionalProperties: false,
  });
}

export function array(type: Schema): Schema {
  return () => ({
    type: "array",
    items: type(),
  });
}

export function union(types: Schema[]): Schema {
  return () => ({
    oneOf: types.map((type) => type()),
  });
}

export function discriminatedUnion(
  _path: string,
  _values: Schema[],
  types: Schema[]
): Schema {
  return union(types);
}

export function intersection(types: Schema[]): Schema {
  return () => ({
    allOf: types.map((type) => type()),
  });
}

export function recursive(fn: (self: Schema) => Schema): Schema {
  return () => ({
    $id: "recursive",
    ...fn(() => ({ $ref: "recursive" }))(),
  });
}

export function tuple(...types: Schema[]): Schema {
  return () => ({
    type: "array",
    prefixItems: types.map((type) => type()),
    items: false,
  });
}

export function callable(): Schema {
  throw new Error("cannot create schema for callable types");
}

export function record(key: Schema, value: Schema): Schema {
  return () => ({
    type: "object",
    patternProperties: {
      [key()]: value(),
    },
  });
}

export const env: Env<SchemaMacro, Schema> = {
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
