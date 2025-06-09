import type { CUSTOM_MAP, MODIFIER_MAP } from "./constants";
import type { GeneralType, SpecialType } from "./transform/type-codegen/common";

export function macro<T extends (...args: any) => any, P extends string>() {
  return (() => {
    throw new Error("Is the type-macro plugin installed?");
  }) as unknown as T & {
    __macro: P;
  };
}

export type AnnotationHandler<T extends Annotation<string, any>, U> = (
  inner: U,
  param: GetAnnotationParam<T>
) => U;

type GetAnnotationParam<T> = T extends Annotation<string, infer U> ? U : never;

export type Annotation<T extends string, U> = {
  __annotation?: {
    [key in T]: U;
  };
};

export type { GeneralType, SpecialType };

type CustomMap = typeof CUSTOM_MAP;
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
  optional(t: U): U;
} & {
  [key in CustomMap[keyof CustomMap]]?: (...t: U[]) => U;
} & {
  [key in ModifierMap[keyof ModifierMap]]?: (t: U) => U;
};
