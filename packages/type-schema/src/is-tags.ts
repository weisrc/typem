import type { TagHandler } from "type-macro";
import type {
  AdditionalProperties,
  ExclusiveMaximum,
  ExclusiveMinimum,
  Format,
  Is,
  Maximum,
  MaxItems,
  MaxLength,
  MaxProperties,
  Minimum,
  MinItems,
  MinLength,
  MinProperties,
  MultipleOf,
  Pattern,
  UniqueItems,
} from ".";
import { context, errorAdd, type ValidationErrorType } from "./context";
import { FORMAT_REGEX_MAP } from "./utils";

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

export const pattern: TagHandler<Pattern<string, string>, Is<string>> = (
  inner,
  [name, source]
) => {
  const regex = new RegExp(source);
  return makePredicate(inner, "invalid-format", name, (x) => regex.test(x));
};

export const format: TagHandler<
  Format<keyof typeof FORMAT_REGEX_MAP>,
  Is<string>
> = (inner, format) =>
  pattern(inner, [format, FORMAT_REGEX_MAP[format].source]);

export const minimum: TagHandler<Minimum<number>, Is<number>> = (
  inner,
  minimum
) => {
  return makePredicate(inner, "minimum", minimum, (x) => x >= minimum);
};

export const maximum: TagHandler<Maximum<number>, Is<number>> = (
  inner,
  maximum
) => {
  return makePredicate(inner, "maximum", maximum, (x) => x <= maximum);
};

export const exclusiveMinimum: TagHandler<
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

export const exclusiveMaximum: TagHandler<
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

export const multipleOf: TagHandler<MultipleOf<number>, Is<number>> = (
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

export const uniqueItems: TagHandler<UniqueItems, Is<any[]>> = (inner) => {
  return makePredicate(inner, "unique-items", undefined, (x) => {
    const set = new Set(x);
    return set.size === x.length;
  });
};

export const maxLength: TagHandler<MaxLength<number>, Is<string>> = (
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

export const minLength: TagHandler<MinLength<number>, Is<string>> = (
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

export const minItems: TagHandler<MinItems<number>, Is<any[]>> = (
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

export const maxItems: TagHandler<MaxItems<number>, Is<any[]>> = (
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

export const minProperties: TagHandler<MinProperties<number>, Is<any>> = (
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

export const maxProperties: TagHandler<MaxProperties<number>, Is<any>> = (
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

export const additionalProperties: TagHandler<AdditionalProperties<boolean>, Is<any>> = (
  inner,
  enabled
) => {
  const output = (x: any) => {
    const previous = context.additionalProperties;
    context.additionalProperties = enabled;
    const result = inner(x);
    context.additionalProperties = previous;
    return result;
  };
  return output as Is<any>;
};
