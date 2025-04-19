import { macro, type Tag } from "type-macro";
import { context } from "./context";
import type { FORMAT_REGEX_MAP } from "./formats";

export type Is<T> = (x: any) => x is T;
export type IsMacro = <T>() => Is<T>;
export const is = macro<IsMacro, "type-schema/is-env">();

export type Schema<_T = any> = () => any;
export type SchemaMacro = <T>() => Schema<T>;
export const schema = macro<SchemaMacro, "type-schema/schema-env">();

export type Minimum<T extends number> = Tag<"minimum", T>;
export type Maximum<T extends number> = Tag<"maximum", T>;
export type MinProperties<T extends number> = Tag<"minProperties", T>;
export type MaxProperties<T extends number> = Tag<"maxProperties", T>;
export type AdditionalProperties<T extends boolean> = Tag<
  "additionalProperties",
  T
>;
export type MaxItems<T extends number> = Tag<"maxItems", T>;
export type MinItems<T extends number> = Tag<"minItems", T>;
export type MinLength<T extends number> = Tag<"minLength", T>;
export type MaxLength<T extends number> = Tag<"maxLength", T>;
export type UniqueItems = Tag<"uniqueItems", true>;
export type MultipleOf<T extends number> = Tag<"multipleOf", T>;
export type ExclusiveMaximum<T extends number> = Tag<"exclusiveMaximum", T>;
export type ExclusiveMinimum<T extends number> = Tag<"exclusiveMinimum", T>;
export type Format<T extends keyof typeof FORMAT_REGEX_MAP> = Tag<"format", T>;
export type Pattern<Name extends string, Regex extends string> = Tag<
  "pattern",
  [Name, Regex]
>;

export function withErrors<T>(is: Is<T>): Is<T> {
  return (x: any) => {
    context.enableErrors = true;
    context.errors = [];
    const result = is(x);
    context.enableErrors = false;
    return result;
  };
}

export function getErrors() {
  return context.errors;
}
