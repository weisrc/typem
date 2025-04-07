import { macro, type Annotation } from "type-macro";
import type { IsMacro } from "./types";

export const is = macro<IsMacro, "is-macro/env">();

export type Email = Annotation<"email", []>;

export type Range<Min extends number, Max extends number> = Annotation<
  "range",
  [Min, Max]
>;
