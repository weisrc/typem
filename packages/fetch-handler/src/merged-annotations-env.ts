import type { AnnotationHandler } from "typem/macro";
import type {
  AdditionalProperties,
  Default,
  Deprecated,
  Description,
  Examples,
  ExclusiveMaximum,
  ExclusiveMinimum,
  Format,
  FormatType,
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
  ReadOnly,
  ReferenceId,
  Title,
  UniqueItems,
  WriteOnly,
} from "typem";
import * as predicateEnv from "@typem/predicate/env";
import * as jsonSchemaEnv from "@typem/json-schema/env";
import type { Merged } from "./types";

export const pattern: AnnotationHandler<
  Pattern<string, string>,
  Merged<string>
> = (inner, [name, source]) => ({
  predicate: predicateEnv.pattern(inner.predicate, [name, source]),
  schema: jsonSchemaEnv.pattern(inner.schema, [name, source]),
});

export const format: AnnotationHandler<Format<FormatType>, Merged<string>> = (
  inner,
  format
) => ({
  predicate: predicateEnv.format(inner.predicate, format),
  schema: jsonSchemaEnv.format(inner.schema, format),
});

export const minimum: AnnotationHandler<Minimum<number>, Merged<number>> = (
  inner,
  minimum
) => ({
  predicate: predicateEnv.minimum(inner.predicate, minimum),
  schema: jsonSchemaEnv.minimum(inner.schema, minimum),
});

export const maximum: AnnotationHandler<Maximum<number>, Merged<number>> = (
  inner,
  maximum
) => ({
  predicate: predicateEnv.maximum(inner.predicate, maximum),
  schema: jsonSchemaEnv.maximum(inner.schema, maximum),
});

export const exclusiveMinimum: AnnotationHandler<
  ExclusiveMinimum<number>,
  Merged<number>
> = (inner, exclusiveMinimum) => ({
  predicate: predicateEnv.exclusiveMinimum(inner.predicate, exclusiveMinimum),
  schema: jsonSchemaEnv.exclusiveMinimum(inner.schema, exclusiveMinimum),
});

export const exclusiveMaximum: AnnotationHandler<
  ExclusiveMaximum<number>,
  Merged<number>
> = (inner, exclusiveMaximum) => ({
  predicate: predicateEnv.exclusiveMaximum(inner.predicate, exclusiveMaximum),
  schema: jsonSchemaEnv.exclusiveMaximum(inner.schema, exclusiveMaximum),
});

export const multipleOf: AnnotationHandler<
  MultipleOf<number>,
  Merged<number>
> = (inner, multipleOf) => ({
  predicate: predicateEnv.multipleOf(inner.predicate, multipleOf),
  schema: jsonSchemaEnv.multipleOf(inner.schema, multipleOf),
});

export const uniqueItems: AnnotationHandler<UniqueItems, Merged<any[]>> = (
  inner
) => ({
  predicate: predicateEnv.uniqueItems(inner.predicate, true),
  schema: jsonSchemaEnv.uniqueItems(inner.schema, true),
});

export const maxLength: AnnotationHandler<MaxLength<number>, Merged<string>> = (
  inner,
  maxLength
) => ({
  predicate: predicateEnv.maxLength(inner.predicate, maxLength),
  schema: jsonSchemaEnv.maxLength(inner.schema, maxLength),
});

export const minLength: AnnotationHandler<MinLength<number>, Merged<string>> = (
  inner,
  minLength
) => ({
  predicate: predicateEnv.minLength(inner.predicate, minLength),
  schema: jsonSchemaEnv.minLength(inner.schema, minLength),
});

export const minItems: AnnotationHandler<MinItems<number>, Merged<any[]>> = (
  inner,
  minItems
) => ({
  predicate: predicateEnv.minItems(inner.predicate, minItems),
  schema: jsonSchemaEnv.minItems(inner.schema, minItems),
});

export const maxItems: AnnotationHandler<MaxItems<number>, Merged<any[]>> = (
  inner,
  maxItems
) => ({
  predicate: predicateEnv.maxItems(inner.predicate, maxItems),
  schema: jsonSchemaEnv.maxItems(inner.schema, maxItems),
});

export const minProperties: AnnotationHandler<
  MinProperties<number>,
  Merged<any>
> = (inner, minProperties) => ({
  predicate: predicateEnv.minProperties(inner.predicate, minProperties),
  schema: jsonSchemaEnv.minProperties(inner.schema, minProperties),
});

export const maxProperties: AnnotationHandler<
  MaxProperties<number>,
  Merged<any>
> = (inner, maxProperties) => ({
  predicate: predicateEnv.maxProperties(inner.predicate, maxProperties),
  schema: jsonSchemaEnv.maxProperties(inner.schema, maxProperties),
});

export const additionalProperties: AnnotationHandler<
  AdditionalProperties<boolean>,
  Merged<any>
> = (inner, enabled) => ({
  predicate: predicateEnv.additionalProperties(inner.predicate, enabled),
  schema: jsonSchemaEnv.additionalProperties(inner.schema, enabled),
});

export const referenceId: AnnotationHandler<
  ReferenceId<string>,
  Merged<any>
> = (inner, referenceId) => ({
  predicate: inner.predicate,
  schema: jsonSchemaEnv.referenceId(inner.schema, referenceId),
});

export const title: AnnotationHandler<Title<string>, Merged<any>> = (
  inner,
  title
) => ({
  predicate: inner.predicate,
  schema: jsonSchemaEnv.title(inner.schema, title),
});

export const description: AnnotationHandler<
  Description<string>,
  Merged<any>
> = (inner, description) => ({
  predicate: inner.predicate,
  schema: jsonSchemaEnv.description(inner.schema, description),
});

export const deprecated: AnnotationHandler<Deprecated, Merged<any>> = (
  inner
) => ({
  predicate: inner.predicate,
  schema: jsonSchemaEnv.deprecated(inner.schema, true),
});

export const readOnly: AnnotationHandler<ReadOnly, Merged<any>> = (inner) => ({
  predicate: inner.predicate,
  schema: jsonSchemaEnv.readOnly(inner.schema, true),
});

export const writeOnly: AnnotationHandler<WriteOnly, Merged<any>> = (
  inner
) => ({
  predicate: inner.predicate,
  schema: jsonSchemaEnv.writeOnly(inner.schema, true),
});

export const defaultValue: AnnotationHandler<Default<any>, Merged<any>> = (
  inner,
  defaultValue
) => ({
  predicate: inner.predicate,
  schema: jsonSchemaEnv.defaultValue(inner.schema, defaultValue),
});

export const examples: AnnotationHandler<Examples<any[]>, Merged<any>> = (
  inner,
  examples
) => ({
  predicate: inner.predicate,
  schema: jsonSchemaEnv.examples(inner.schema, examples),
});
