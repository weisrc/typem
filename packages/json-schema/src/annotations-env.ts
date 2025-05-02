import type {
  AdditionalProperties,
  Default,
  Deprecated,
  Description,
  Examples,
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
  ReadOnly,
  ReferenceId,
  Title,
  UniqueItems,
  WriteOnly,
} from "typem";
import type { AnnotationHandler } from "typem/macro";
import type { JsonSchema } from ".";
import { FORMAT_REGEX_MAP } from "./utils";
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

export const referenceId: AnnotationHandler<ReferenceId<string>, JsonSchema> =
  (inner, referenceId) => () => ({
    ...inner(),
    $id: referenceId,
  });

export const title: AnnotationHandler<Title<string>, JsonSchema> =
  (inner, title) => () => ({
    ...inner(),
    title,
  });

export const description: AnnotationHandler<Description<string>, JsonSchema> =
  (inner, description) => () => ({
    ...inner(),
    description,
  });

export const deprecated: AnnotationHandler<Deprecated, JsonSchema> =
  (inner) => () => ({
    ...inner(),
    deprecated: true,
  });

export const readOnly: AnnotationHandler<ReadOnly, JsonSchema> =
  (inner) => () => ({
    ...inner(),
    readOnly: true,
  });

export const writeOnly: AnnotationHandler<WriteOnly, JsonSchema> =
  (inner) => () => ({
    ...inner(),
    writeOnly: true,
  });

export const defaultValue: AnnotationHandler<Default<any>, JsonSchema> =
  (inner, defaultValue) => () => ({
    ...inner(),
    default: defaultValue,
  });

export const examples: AnnotationHandler<Examples<any[]>, JsonSchema> =
  (inner, examples) => () => ({
    ...inner(),
    examples,
  });
