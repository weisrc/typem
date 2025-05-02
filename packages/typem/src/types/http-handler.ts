import type { Annotation } from "../macro";

export type FromInput<Id extends string, Arg> = Annotation<
  "fromInput",
  [Id, Arg]
>;

export type FromParam<Name extends string> = FromInput<"param", Name>;

export type FromQuery<Name extends string> = FromInput<"query", Name>;

export type FromJson = FromInput<"json", []>;

export type FromHeader<Name extends string> = FromInput<"header", Name>;

export type FromCookie<Name extends string> = FromInput<"cookie", Name>;

export type FromRequest = FromInput<"request", []>;
