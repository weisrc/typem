import type { BUILTIN_MAP, MODIFIER_MAP } from "./constants";
import type { GeneralType, SpecialType } from "./transform/type-codegen/common";

export function macro<T extends (...args: any) => any, P extends string>() {
  return (() => {
    throw new Error("Is the type-macro plugin installed?");
  }) as unknown as T & {
    __macro: P;
  };
}

export type TagHandler<T extends Tag<string, any>, U, V = U> = (
  inner: U,
  param: GetTagParam<T>
) => V;

type GetTagParam<T> = T extends Tag<string, infer U> ? U : never;

export type Tag<T extends string, U> = {
  __tag?: {
    [key in T]: U;
  };
};

export type { GeneralType, SpecialType };

type BuiltinMap = typeof BUILTIN_MAP;
type ModifierMap = typeof MODIFIER_MAP;

export type Env<T, U> = {
  entry(...args: any): T;
  error(message: string): U;
  general(type: GeneralType): U;
  special(type: SpecialType): U;
  record(key: U, value: U): U;
  literal(value: any): U;
  object(shape: { [key: string]: U }, required: string[]): U;
  union(t: U[]): U;
  discriminatedUnion(path: string, values: any[], t: U[]): U;
  intersection(t: U[]): U;
  recursive(fn: (self: U) => U): U;
  callable(t: U, signatures: [U[], U][]): U;
} & {
  [key in BuiltinMap[keyof BuiltinMap]]?: (...t: U[]) => U;
} & {
  [key in ModifierMap[keyof ModifierMap]]?: (t: U) => U;
};
