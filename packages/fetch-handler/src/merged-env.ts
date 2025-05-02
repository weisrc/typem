import type { GeneralType, SpecialType } from "typem/macro";
import * as predicateEnv from "@typem/predicate/env";
import * as jsonSchemaEnv from "@typem/json-schema/env";
import type { Merged } from "./types";
import { mapObjectValues } from "./utils";

export * from "./merged-annotations-env";

export function general(type: GeneralType): Merged<any> {
  return {
    isUndefined: type === "undefined",
    predicate: predicateEnv.general(type),
    schema: jsonSchemaEnv.general(type),
  };
}

export function special(type: SpecialType): Merged<any> {
  return {
    predicate: predicateEnv.special(type),
    schema: jsonSchemaEnv.special(type),
  };
}

export function literal(value: any): Merged<any> {
  return {
    predicate: predicateEnv.literal(value),
    schema: jsonSchemaEnv.literal(value),
  };
}

export function object<T extends object>(
  shape: { [key in keyof T]: Merged<any> },
  required: string[]
): Merged<any> {
  return {
    predicate: predicateEnv.object(
      mapObjectValues(shape, (value) => value.predicate),
      required
    ),
    schema: jsonSchemaEnv.object(
      mapObjectValues(shape, (value) => value.schema),
      required
    ),
  };
}

export function array(type: Merged<any>): Merged<any> {
  return {
    predicate: predicateEnv.array(type.predicate),
    schema: jsonSchemaEnv.array(type.schema),
  };
}

export function union(types: Merged<any>[]): Merged<any> {
  return {
    inner: {
      mode: "union",
      types,
    },
    predicate: predicateEnv.union(types.map((type) => type.predicate)),
    schema: jsonSchemaEnv.union(types.map((type) => type.schema)),
  };
}

export function discriminatedUnion(
  path: string,
  values: Merged<any>[],
  types: Merged<any>[]
): Merged<any> {
  return {
    inner: {
      mode: "union",
      types,
    },
    predicate: predicateEnv.discriminatedUnion(
      path,
      values.map((value) => value.predicate),
      types.map((type) => type.predicate)
    ),
    schema: jsonSchemaEnv.discriminatedUnion(
      path,
      values.map((value) => value.schema),
      types.map((type) => type.schema)
    ),
  };
}

export function intersection(types: Merged<any>[]): Merged<any> {
  return {
    inner: {
      mode: "intersection",
      types,
    },
    predicate: predicateEnv.intersection(types.map((type) => type.predicate)),
    schema: jsonSchemaEnv.intersection(types.map((type) => type.schema)),
  };
}

export function recursive(fn: (self: Merged<any>) => Merged<any>): Merged<any> {
  let result: Merged<any>;
  result = {
    predicate: predicateEnv.recursive((selfIs) => {
      const selfRef: Merged<any> = {
        predicate: selfIs,
        schema: {} as any,
      };
      return fn(selfRef).predicate;
    }),
    schema: jsonSchemaEnv.recursive((selfSchema) => {
      const selfRef: Merged<any> = {
        predicate: {} as any,
        schema: selfSchema,
      };
      return fn(selfRef).schema;
    }),
  };
  return result;
}

export function tuple(...types: Merged<any>[]): Merged<any> {
  const predicates = types.map((type) => type.predicate);
  const schemas = types.map((type) => type.schema);
  const predicate = predicateEnv.tuple(...predicates);
  const schema = jsonSchemaEnv.tuple(...schemas);

  return {
    inner: {
      mode: "tuple",
      types,
    },
    predicate,
    schema,
  };
}

export function record(key: Merged<any>, value: Merged<any>): Merged<any> {
  return {
    predicate: predicateEnv.record(key.predicate, value.predicate),
    schema: jsonSchemaEnv.record(key.schema, value.schema),
  };
}
