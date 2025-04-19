import type { Tag, TagFunction } from "type-macro";
import { FORMAT_REGEX_MAP } from "./formats";
import type { Is } from ".";
import { context, errorAdd, type ValidationErrorType } from "./context";

function makePredicate<T>(
  inner: Is<T>,
  type: ValidationErrorType,
  target: any,
  predicate: (x: any) => boolean
): Is<T> {
  return ((x: any) => {
    if (!inner(x)) {
      return false;
    }
    const ok = predicate(x);
    if (!ok) {
      errorAdd(type, target);
    }
    return ok;
  }) as Is<T>;
}

export type Pattern<Name extends string, Regex extends string> = Tag<
  "pattern",
  [Name, Regex]
>;
export const pattern: TagFunction<Pattern<string, string>, Is<string>> = (
  inner,
  [name, source]
) => {
  const regex = new RegExp(source);
  return makePredicate(inner, "invalid-format", name, (x) => regex.test(x));
};

export type Format<T extends keyof typeof FORMAT_REGEX_MAP> = Tag<"format", T>;
export const format: TagFunction<
  Format<keyof typeof FORMAT_REGEX_MAP>,
  Is<string>
> = (inner, format) =>
  pattern(inner, [format, FORMAT_REGEX_MAP[format].source]);

export type Minimum<T extends number> = Tag<"minimum", T>;
export const minimum: TagFunction<Minimum<number>, Is<number>> = (
  inner,
  minimum
) => {
  return makePredicate(inner, "minimum", minimum, (x) => x >= minimum);
};

export type Maximum<T extends number> = Tag<"maximum", T>;
export const maximum: TagFunction<Maximum<number>, Is<number>> = (
  inner,
  maximum
) => {
  return makePredicate(inner, "maximum", maximum, (x) => x <= maximum);
};

export type ExclusiveMinimum<T extends number> = Tag<"exclusiveMinimum", T>;
export const exclusiveMinimum: TagFunction<
  ExclusiveMinimum<number>,
  Is<number>
> = (inner, exclusiveMinimum) => {
  return makePredicate(
    inner,
    "exclusive-minimum",
    exclusiveMinimum,
    (x) => x > exclusiveMinimum
  );
};

export type ExclusiveMaximum<T extends number> = Tag<"exclusiveMaximum", T>;
export const exclusiveMaximum: TagFunction<
  ExclusiveMaximum<number>,
  Is<number>
> = (inner, exclusiveMaximum) => {
  return makePredicate(
    inner,
    "exclusive-maximum",
    exclusiveMaximum,
    (x) => x < exclusiveMaximum
  );
};

export type MultipleOf<T extends number> = Tag<"multipleOf", T>;
export const multipleOf: TagFunction<MultipleOf<number>, Is<number>> = (
  inner,
  multipleOf
) => {
  return makePredicate(
    inner,
    "multiple-of",
    multipleOf,
    (x) => x % multipleOf === 0
  );
};

export type UniqueItems = Tag<"uniqueItems", true>;
export const uniqueItems: TagFunction<UniqueItems, Is<any[]>> = (inner) => {
  return makePredicate(inner, "unique-items", undefined, (x) => {
    const set = new Set(x);
    return set.size === x.length;
  });
};

export type MaxLength<T extends number> = Tag<"maxLength", T>;
export const maxLength: TagFunction<MaxLength<number>, Is<string>> = (
  inner,
  maxLength
) => {
  return makePredicate(
    inner,
    "max-length",
    maxLength,
    (x) => x.length <= maxLength
  );
};

export type MinLength<T extends number> = Tag<"minLength", T>;
export const minLength: TagFunction<MinLength<number>, Is<string>> = (
  inner,
  minLength
) => {
  return makePredicate(
    inner,
    "min-length",
    minLength,
    (x) => x.length >= minLength
  );
};

export type MinItems<T extends number> = Tag<"minItems", T>;
export const minItems: TagFunction<MinItems<number>, Is<any[]>> = (
  inner,
  minItems
) => {
  return makePredicate(
    inner,
    "min-items",
    minItems,
    (x) => x.length >= minItems
  );
};

export type MaxItems<T extends number> = Tag<"maxItems", T>;
export const maxItems: TagFunction<MaxItems<number>, Is<any[]>> = (
  inner,
  maxItems
) => {
  return makePredicate(
    inner,
    "max-items",
    maxItems,
    (x) => x.length <= maxItems
  );
};

export type MinProperties<T extends number> = Tag<"minProperties", T>;
export const minProperties: TagFunction<MinProperties<number>, Is<any>> = (
  inner,
  minProperties
) => {
  return additionalProperties(
    makePredicate(
      inner,
      "min-properties",
      minProperties,
      (x) => Object.keys(x).length >= minProperties
    ),
    true
  );
};

export type MaxProperties<T extends number> = Tag<"maxProperties", T>;
export const maxProperties: TagFunction<MaxProperties<number>, Is<any>> = (
  inner,
  maxProperties
) => {
  return additionalProperties(
    makePredicate(
      inner,
      "max-properties",
      maxProperties,
      (x) => Object.keys(x).length <= maxProperties
    ),
    true
  );
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
