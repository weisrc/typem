import type { TagHandler } from "type-macro";
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
  Schema,
  UniqueItems,
} from ".";
import { FORMAT_REGEX_MAP } from "./formats";
export const pattern: TagHandler<Pattern<string, string>, Schema> =
  (inner, [name, source]) =>
  () =>
    name in FORMAT_REGEX_MAP
      ? {
          ...inner,
          format: name,
        }
      : {
          ...inner,
          pattern: source,
        };

export const format: TagHandler<
  Format<keyof typeof FORMAT_REGEX_MAP>,
  Schema
> = (inner, format) => () =>
  pattern(inner, [format, FORMAT_REGEX_MAP[format].source])();

export const minimum: TagHandler<Minimum<number>, Schema> =
  (inner, minimum) => () => ({
    ...inner,
    minimum,
  });

export const maximum: TagHandler<Maximum<number>, Schema> =
  (inner, maximum) => () => ({
    ...inner,
    maximum,
  });

export const exclusiveMinimum: TagHandler<ExclusiveMinimum<number>, Schema> =
  (inner, exclusiveMinimum) => () => ({
    ...inner,
    exclusiveMinimum,
  });

export const exclusiveMaximum: TagHandler<ExclusiveMaximum<number>, Schema> =
  (inner, exclusiveMaximum) => () => ({
    ...inner,
    exclusiveMaximum,
  });

export const multipleOf: TagHandler<MultipleOf<number>, Schema> =
  (inner, multipleOf) => () => ({
    ...inner,
    multipleOf,
  });

export const uniqueItems: TagHandler<UniqueItems, Schema> = (inner) => () => ({
  ...inner,
  uniqueItems: true,
});

export const maxLength: TagHandler<MaxLength<number>, Schema> =
  (inner, maxLength) => () => ({
    ...inner,
    maxLength,
  });

export const minLength: TagHandler<MinLength<number>, Schema> =
  (inner, minLength) => () => ({
    ...inner,
    minLength,
  });

export const minItems: TagHandler<MinItems<number>, Schema> =
  (inner, minItems) => () => ({
    ...inner,
    minItems,
  });

export const maxItems: TagHandler<MaxItems<number>, Schema> =
  (inner, maxItems) => () => ({
    ...inner,
    maxItems,
  });

export const minProperties: TagHandler<MinProperties<number>, Schema> =
  (inner, minProperties) => () => ({
    ...inner,
    minProperties,
  });

export const maxProperties: TagHandler<MaxProperties<number>, Schema> =
  (inner, maxProperties) => () => ({
    ...inner,
    maxProperties,
  });

export const additionalProperties: TagHandler<AdditionalProperties, Schema> =
  (inner) => () => ({
    ...inner,
    additionalProperties: true,
  });
