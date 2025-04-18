import type { Tag, TagFunction } from "type-macro";
import { FORMAT_REGEX_MAP } from "./formats";
import type { Is } from ".";
import { context } from "./env";

function makePredicate<T>(inner: Is<T>, predicate: (x: any) => boolean): Is<T> {
  return ((x: any) => {
    if (!inner(x)) {
      return false;
    }
    return predicate(x);
  }) as Is<T>;
}

export type Pattern<T extends string> = Tag<"pattern", T>;
export const pattern: TagFunction<Pattern<string>, Is<string>> = (
  inner,
  pattern
) => {
  const regex = new RegExp(pattern);
  return makePredicate(inner, (x) => regex.test(x));
};

export type Format<T extends keyof typeof FORMAT_REGEX_MAP> = Tag<"format", T>;
export const format: TagFunction<
  Format<keyof typeof FORMAT_REGEX_MAP>,
  Is<string>
> = (inner, format) => pattern(inner, FORMAT_REGEX_MAP[format].source);

export type Minimum<T extends number> = Tag<"minimum", T>;
export const minimum: TagFunction<Minimum<number>, Is<number>> = (
  inner,
  minimum
) => {
  return makePredicate(inner, (x) => x >= minimum);
};

export type Maximum<T extends number> = Tag<"maximum", T>;
export const maximum: TagFunction<Maximum<number>, Is<number>> = (
  inner,
  maximum
) => {
  return makePredicate(inner, (x) => x <= maximum);
};

export type ExclusiveMinimum<T extends number> = Tag<"exclusiveMinimum", T>;
export const exclusiveMinimum: TagFunction<
  ExclusiveMinimum<number>,
  Is<number>
> = (inner, exclusiveMinimum) => {
  return makePredicate(inner, (x) => x > exclusiveMinimum);
};

export type ExclusiveMaximum<T extends number> = Tag<"exclusiveMaximum", T>;
export const exclusiveMaximum: TagFunction<
  ExclusiveMaximum<number>,
  Is<number>
> = (inner, exclusiveMaximum) => {
  return makePredicate(inner, (x) => x < exclusiveMaximum);
};

export type MultipleOf<T extends number> = Tag<"multipleOf", T>;
export const multipleOf: TagFunction<MultipleOf<number>, Is<number>> = (
  inner,
  multipleOf
) => {
  return makePredicate(inner, (x) => x % multipleOf === 0);
};

export type UniqueItems = Tag<"uniqueItems", true>;
export const uniqueItems: TagFunction<UniqueItems, Is<any[]>> = (inner) => {
  return makePredicate(inner, (x) => {
    const set = new Set(x);
    return set.size === x.length;
  });
};

export type MaxLength<T extends number> = Tag<"maxLength", T>;
export const maxLength: TagFunction<MaxLength<number>, Is<string>> = (
  inner,
  maxLength
) => {
  return makePredicate(inner, (x) => x.length <= maxLength);
};
export type MinLength<T extends number> = Tag<"minLength", T>;
export const minLength: TagFunction<MinLength<number>, Is<string>> = (
  inner,
  minLength
) => {
  return makePredicate(inner, (x) => x.length >= minLength);
};

export type MinItems<T extends number> = Tag<"minItems", T>;
export const minItems: TagFunction<MinItems<number>, Is<any[]>> = (
  inner,
  minItems
) => {
  return makePredicate(inner, (x) => x.length >= minItems);
};

export type MaxItems<T extends number> = Tag<"maxItems", T>;
export const maxItems: TagFunction<MaxItems<number>, Is<any[]>> = (
  inner,
  maxItems
) => {
  return makePredicate(inner, (x) => x.length <= maxItems);
};

export type AdditionalProperties = Tag<"additionalProperties", true>;
export const additionalProperties: TagFunction<
  AdditionalProperties,
  Is<any>
> = (inner) => {
  const output = (x: any) => {
    const previous = context.additionalProperties;
    context.additionalProperties = true;
    const result = inner(x);
    context.additionalProperties = previous;
    return result;
  };
  return output as Is<any>;
};

export type MinProperties<T extends number> = Tag<"minProperties", T>;
export const minProperties: TagFunction<MinProperties<number>, Is<any>> = (
  inner,
  minProperties
) => {
  return additionalProperties(
    makePredicate(inner, (x) => Object.keys(x).length >= minProperties),
    true
  );
};

export type MaxProperties<T extends number> = Tag<"maxProperties", T>;
export const maxProperties: TagFunction<MaxProperties<number>, Is<any>> = (
  inner,
  maxProperties
) => {
  return additionalProperties(
    makePredicate(inner, (x) => Object.keys(x).length <= maxProperties),
    true
  );
};
