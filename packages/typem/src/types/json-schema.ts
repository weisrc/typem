import type { Annotation } from "../macro";

export const FORMAT_TYPES = [
  "date-time",
  "date",
  "time",
  "duration",
  "email",
  "idn-email",
  "hostname",
  "idn-hostname",
  "ipv4",
  "ipv6",
  "uuid",
  "uri",
  "uri-reference",
  "iri",
  "iri-reference",
  "uri-template",
  "json-pointer",
  "relative-json-pointer",
  "regex",
] as const;

export type FormatType = (typeof FORMAT_TYPES)[number];

export type Format<T extends FormatType> = Annotation<"format", T>;

export type Minimum<T extends number> = Annotation<"minimum", T>;
export type Maximum<T extends number> = Annotation<"maximum", T>;
export type MinProperties<T extends number> = Annotation<"minProperties", T>;
export type MaxProperties<T extends number> = Annotation<"maxProperties", T>;
export type AdditionalProperties<T extends boolean> = Annotation<
  "additionalProperties",
  T
>;
export type MaxItems<T extends number> = Annotation<"maxItems", T>;
export type MinItems<T extends number> = Annotation<"minItems", T>;
export type MinLength<T extends number> = Annotation<"minLength", T>;
export type MaxLength<T extends number> = Annotation<"maxLength", T>;
export type UniqueItems = Annotation<"uniqueItems", true>;
export type MultipleOf<T extends number> = Annotation<"multipleOf", T>;
export type ExclusiveMaximum<T extends number> = Annotation<"exclusiveMaximum", T>;
export type ExclusiveMinimum<T extends number> = Annotation<"exclusiveMinimum", T>;

export type Pattern<Name extends string, Regex extends string> = Annotation<
  "pattern",
  [Name, Regex]
>;

export type ReferenceId<Id extends string> = Annotation<"referenceId", Id>;
export type Title<Text extends string> = Annotation<"title", Text>;
export type Description<Text extends string> = Annotation<"description", Text>;
export type Default<Value> = Annotation<"defaultValue", Value>;
export type Examples<Values extends any[]> = Annotation<"examples", Values>;
export type Deprecated = Annotation<"deprecated", true>;
export type ReadOnly = Annotation<"readOnly", true>;
export type WriteOnly = Annotation<"writeOnly", true>;