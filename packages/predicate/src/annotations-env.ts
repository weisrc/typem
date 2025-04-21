import type { AnnotationHandler } from "typem/macro";
import type {
  AdditionalProperties,
  ExclusiveMaximum,
  ExclusiveMinimum,
  Format,
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
} from "typem";
import { context, errorAdd, type ValidationErrorType } from "./context";
import { FORMAT_REGEX_MAP } from "./utils";
import type { Predicate } from ".";

function makePredicate<T>(
  inner: Predicate<T>,
  type: ValidationErrorType,
  target: any,
  predicate: (x: any) => boolean
): Predicate<T> {
  return ((x: any) => {
    if (!inner(x)) {
      return false;
    }
    const ok = predicate(x);
    if (!ok) {
      errorAdd(type, target);
    }
    return ok;
  }) as Predicate<T>;
}

export const pattern: AnnotationHandler<Pattern<string, string>, Predicate<string>> = (
  inner,
  [name, source]
) => {
  const regex = new RegExp(source);
  return makePredicate(inner, "invalid-format", name, (x) => regex.test(x));
};

export const format: AnnotationHandler<
  Format<keyof typeof FORMAT_REGEX_MAP>,
  Predicate<string>
> = (inner, format) =>
  pattern(inner, [format, FORMAT_REGEX_MAP[format].source]);

export const minimum: AnnotationHandler<Minimum<number>, Predicate<number>> = (
  inner,
  minimum
) => {
  return makePredicate(inner, "minimum", minimum, (x) => x >= minimum);
};

export const maximum: AnnotationHandler<Maximum<number>, Predicate<number>> = (
  inner,
  maximum
) => {
  return makePredicate(inner, "maximum", maximum, (x) => x <= maximum);
};

export const exclusiveMinimum: AnnotationHandler<
  ExclusiveMinimum<number>,
  Predicate<number>
> = (inner, exclusiveMinimum) => {
  return makePredicate(
    inner,
    "exclusive-minimum",
    exclusiveMinimum,
    (x) => x > exclusiveMinimum
  );
};

export const exclusiveMaximum: AnnotationHandler<
  ExclusiveMaximum<number>,
  Predicate<number>
> = (inner, exclusiveMaximum) => {
  return makePredicate(
    inner,
    "exclusive-maximum",
    exclusiveMaximum,
    (x) => x < exclusiveMaximum
  );
};

export const multipleOf: AnnotationHandler<MultipleOf<number>, Predicate<number>> = (
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

export const uniqueItems: AnnotationHandler<UniqueItems, Predicate<any[]>> = (inner) => {
  return makePredicate(inner, "unique-items", undefined, (x) => {
    const set = new Set(x);
    return set.size === x.length;
  });
};

export const maxLength: AnnotationHandler<MaxLength<number>, Predicate<string>> = (
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

export const minLength: AnnotationHandler<MinLength<number>, Predicate<string>> = (
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

export const minItems: AnnotationHandler<MinItems<number>, Predicate<any[]>> = (
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

export const maxItems: AnnotationHandler<MaxItems<number>, Predicate<any[]>> = (
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

export const minProperties: AnnotationHandler<MinProperties<number>, Predicate<any>> = (
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

export const maxProperties: AnnotationHandler<MaxProperties<number>, Predicate<any>> = (
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

export const additionalProperties: AnnotationHandler<
  AdditionalProperties<boolean>,
  Predicate<any>
> = (inner, enabled) => {
  const output = (x: any) => {
    const previous = context.additionalProperties;
    context.additionalProperties = enabled;
    const result = inner(x);
    context.additionalProperties = previous;
    return result;
  };
  return output as Predicate<any>;
};
