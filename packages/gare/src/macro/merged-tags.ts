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
  UniqueItems,
} from "type-schema";
import { FORMAT_REGEX_MAP } from "type-schema";
import * as isEnv from "type-schema/is-env";
import * as schemaEnv from "type-schema/schema-env";
import type { Merged } from ".";

export const pattern: TagHandler<Pattern<string, string>, Merged<string>> = (
  inner,
  [name, source]
) => ({
  is: isEnv.pattern(inner.is, [name, source]),
  schema: schemaEnv.pattern(inner.schema, [name, source]),
});

export const format: TagHandler<
  Format<keyof typeof FORMAT_REGEX_MAP>,
  Merged<string>
> = (inner, format) => ({
  is: isEnv.format(inner.is, format),
  schema: schemaEnv.format(inner.schema, format),
});

export const minimum: TagHandler<Minimum<number>, Merged<number>> = (
  inner,
  minimum
) => ({
  is: isEnv.minimum(inner.is, minimum),
  schema: schemaEnv.minimum(inner.schema, minimum),
});

export const maximum: TagHandler<Maximum<number>, Merged<number>> = (
  inner,
  maximum
) => ({
  is: isEnv.maximum(inner.is, maximum),
  schema: schemaEnv.maximum(inner.schema, maximum),
});

export const exclusiveMinimum: TagHandler<
  ExclusiveMinimum<number>,
  Merged<number>
> = (inner, exclusiveMinimum) => ({
  is: isEnv.exclusiveMinimum(inner.is, exclusiveMinimum),
  schema: schemaEnv.exclusiveMinimum(inner.schema, exclusiveMinimum),
});

export const exclusiveMaximum: TagHandler<
  ExclusiveMaximum<number>,
  Merged<number>
> = (inner, exclusiveMaximum) => ({
  is: isEnv.exclusiveMaximum(inner.is, exclusiveMaximum),
  schema: schemaEnv.exclusiveMaximum(inner.schema, exclusiveMaximum),
});

export const multipleOf: TagHandler<MultipleOf<number>, Merged<number>> = (
  inner,
  multipleOf
) => ({
  is: isEnv.multipleOf(inner.is, multipleOf),
  schema: schemaEnv.multipleOf(inner.schema, multipleOf),
});

export const uniqueItems: TagHandler<UniqueItems, Merged<any[]>> = (inner) => ({
  is: isEnv.uniqueItems(inner.is, true),
  schema: schemaEnv.uniqueItems(inner.schema, true),
});

export const maxLength: TagHandler<MaxLength<number>, Merged<string>> = (
  inner,
  maxLength
) => ({
  is: isEnv.maxLength(inner.is, maxLength),
  schema: schemaEnv.maxLength(inner.schema, maxLength),
});

export const minLength: TagHandler<MinLength<number>, Merged<string>> = (
  inner,
  minLength
) => ({
  is: isEnv.minLength(inner.is, minLength),
  schema: schemaEnv.minLength(inner.schema, minLength),
});

export const minItems: TagHandler<MinItems<number>, Merged<any[]>> = (
  inner,
  minItems
) => ({
  is: isEnv.minItems(inner.is, minItems),
  schema: schemaEnv.minItems(inner.schema, minItems),
});

export const maxItems: TagHandler<MaxItems<number>, Merged<any[]>> = (
  inner,
  maxItems
) => ({
  is: isEnv.maxItems(inner.is, maxItems),
  schema: schemaEnv.maxItems(inner.schema, maxItems),
});

export const minProperties: TagHandler<MinProperties<number>, Merged<any>> = (
  inner,
  minProperties
) => ({
  is: isEnv.minProperties(inner.is, minProperties),
  schema: schemaEnv.minProperties(inner.schema, minProperties),
});

export const maxProperties: TagHandler<MaxProperties<number>, Merged<any>> = (
  inner,
  maxProperties
) => ({
  is: isEnv.maxProperties(inner.is, maxProperties),
  schema: schemaEnv.maxProperties(inner.schema, maxProperties),
});

export const additionalProperties: TagHandler<
  AdditionalProperties<boolean>,
  Merged<any>
> = (inner, enabled) => ({
  is: isEnv.additionalProperties(inner.is, enabled),
  schema: schemaEnv.additionalProperties(inner.schema, enabled),
});
