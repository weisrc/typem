import type { Annotation } from "../macro";

export * from "./http-handler";
export * from "./json-schema";

export type Builtin<Id extends string> = Annotation<"builtin", Id>;