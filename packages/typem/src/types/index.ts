import type { Annotation } from "../macro";

export * from "./http-handler";
export * from "./json-schema";

export type Custom<Id extends string> = Annotation<"custom", Id>;