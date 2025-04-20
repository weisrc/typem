import type { GeneralType, SpecialType } from "type-macro";
import * as isEnv from "type-schema/is-env";
import * as schemaEnv from "type-schema/schema-env";
import type { Merged } from ".";
import { mapObjectValues } from "./utils";

export * from "./merged-tags";

export function general(type: GeneralType): Merged<any> {
  return {
    is: isEnv.general(type),
    schema: schemaEnv.general(type),
  };
}

export function special(type: SpecialType): Merged<any> {
  return {
    is: isEnv.special(type),
    schema: schemaEnv.special(type),
  };
}

export function literal(value: any): Merged<any> {
  return {
    is: isEnv.literal(value),
    schema: schemaEnv.literal(value),
  };
}

export function object<T extends object>(
  shape: { [key in keyof T]: Merged<any> },
  required: string[]
): Merged<any> {
  return {
    is: isEnv.object(
      mapObjectValues(shape, (value) => value.is),
      required
    ),
    schema: schemaEnv.object(
      mapObjectValues(shape, (value) => value.schema),
      required
    ),
  };
}

export function array(type: Merged<any>): Merged<any> {
  return {
    is: isEnv.array(type.is),
    schema: schemaEnv.array(type.schema),
  };
}

export function union(types: Merged<any>[]): Merged<any> {
  return {
    is: isEnv.union(types.map((type) => type.is)),
    schema: schemaEnv.union(types.map((type) => type.schema)),
  };
}

export function discriminatedUnion(
  path: string,
  values: Merged<any>[],
  types: Merged<any>[]
): Merged<any> {
  return {
    is: isEnv.discriminatedUnion(
      path,
      values.map((value) => value.is),
      types.map((type) => type.is)
    ),
    schema: schemaEnv.discriminatedUnion(
      path,
      values.map((value) => value.schema),
      types.map((type) => type.schema)
    ),
  };
}

export function intersection(types: Merged<any>[]): Merged<any> {
  return {
    is: isEnv.intersection(types.map((type) => type.is)),
    schema: schemaEnv.intersection(types.map((type) => type.schema)),
  };
}

export function recursive(fn: (self: Merged<any>) => Merged<any>): Merged<any> {
  let result: Merged<any>;
  result = {
    is: isEnv.recursive((selfIs) => {
      const selfRef: Merged<any> = {
        is: selfIs,
        schema: {} as any,
      };
      return fn(selfRef).is;
    }),
    schema: schemaEnv.recursive((selfSchema) => {
      const selfRef: Merged<any> = {
        is: {} as any,
        schema: selfSchema,
      };
      return fn(selfRef).schema;
    }),
  };
  return result;
}

export function tuple(...types: Merged<any>[]): Merged<any> {
  return {
    is: isEnv.tuple(...types.map((type) => type.is)),
    schema: schemaEnv.tuple(...types.map((type) => type.schema)),
  };
}

export function record(key: Merged<any>, value: Merged<any>): Merged<any> {
  return {
    is: isEnv.record(key.is, value.is),
    schema: schemaEnv.record(key.schema, value.schema),
  };
}
