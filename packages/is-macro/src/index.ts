import { macro } from "type-macro";
import type { IsMacro } from "./types";

export const is = macro<IsMacro, "is-macro/env">();
