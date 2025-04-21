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
import { FORMAT_REGEX_MAP } from "./utils";
import type { JsonSchema } from ".";
export const pattern: AnnotationHandler<Pattern<string, string>, JsonSchema> =
  (inner, [name, source]) =>
  () =>
    name in FORMAT_REGEX_MAP
      ? {
          ...inner(),
          format: name,
        }
      : {
          ...inner(),
          pattern: source,
        };

export const format: AnnotationHandler<
  Format<keyof typeof FORMAT_REGEX_MAP>,
  JsonSchema
> = (inner, format) => () =>
  pattern(inner, [format, FORMAT_REGEX_MAP[format].source])();

export const minimum: AnnotationHandler<Minimum<number>, JsonSchema> =
  (inner, minimum) => () => ({
    ...inner(),
    minimum,
  });

export const maximum: AnnotationHandler<Maximum<number>, JsonSchema> =
  (inner, maximum) => () => ({
    ...inner(),
    maximum,
  });

export const exclusiveMinimum: AnnotationHandler<
  ExclusiveMinimum<number>,
  JsonSchema
> = (inner, exclusiveMinimum) => () => ({
  ...inner(),
  exclusiveMinimum,
});

export const exclusiveMaximum: AnnotationHandler<
  ExclusiveMaximum<number>,
  JsonSchema
> = (inner, exclusiveMaximum) => () => ({
  ...inner(),
  exclusiveMaximum,
});

export const multipleOf: AnnotationHandler<MultipleOf<number>, JsonSchema> =
  (inner, multipleOf) => () => ({
    ...inner(),
    multipleOf,
  });

export const uniqueItems: AnnotationHandler<UniqueItems, JsonSchema> =
  (inner) => () => ({
    ...inner(),
    uniqueItems: true,
  });

export const maxLength: AnnotationHandler<MaxLength<number>, JsonSchema> =
  (inner, maxLength) => () => ({
    ...inner(),
    maxLength,
  });

export const minLength: AnnotationHandler<MinLength<number>, JsonSchema> =
  (inner, minLength) => () => ({
    ...inner(),
    minLength,
  });

export const minItems: AnnotationHandler<MinItems<number>, JsonSchema> =
  (inner, minItems) => () => ({
    ...inner(),
    minItems,
  });

export const maxItems: AnnotationHandler<MaxItems<number>, JsonSchema> =
  (inner, maxItems) => () => ({
    ...inner(),
    maxItems,
  });

export const minProperties: AnnotationHandler<
  MinProperties<number>,
  JsonSchema
> = (inner, minProperties) => () => ({
  ...inner(),
  minProperties,
});

export const maxProperties: AnnotationHandler<
  MaxProperties<number>,
  JsonSchema
> = (inner, maxProperties) => () => ({
  ...inner(),
  maxProperties,
});

export const additionalProperties: AnnotationHandler<
  AdditionalProperties<boolean>,
  JsonSchema
> = (inner, enabled) => () => ({
  ...inner(),
  additionalProperties: enabled,
});
