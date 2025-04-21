import type { Annotation } from "../macro";

export type FromInput<Id extends string, Arg> = Annotation<
  "fromInput",
  [Id, Arg]
>;

export type FromParam<Name extends string> = FromInput<"fromParam", Name>;
