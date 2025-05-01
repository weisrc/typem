import type { Annotation } from "../macro";

export type FromInput<Id extends string, Arg> = Annotation<
  "fromInput",
  [Id, Arg]
>;

export type FromParam<Name extends string> = FromInput<"fromParam", Name>;

export type FromQuery<Name extends string> = FromInput<"fromQuery", Name>;

export type FromBody<ContentType extends string> = FromInput<"fromBody", ContentType>;

export type FromHeader<Name extends string> = FromInput<"fromHeader", Name>;

export type FromCookie<Name extends string> = FromInput<"fromCookie", Name>;

export type FromRequest = FromInput<"fromRequest", []>;