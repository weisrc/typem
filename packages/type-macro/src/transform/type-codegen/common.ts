import type ts from "typescript";

export type TypeMap = Map<ts.Type, { ref: string; recursive: boolean }>;

export const regularTypes = [
  "undefined",
  "object",
  "boolean",
  "number",
  "bigint",
  "string",
  "symbol",
  "function",
] as const;

export const specialTypes = ["any", "unknown", "never", "void"] as const;

export type RegularType = (typeof regularTypes)[number];

export type SpecialType = (typeof specialTypes)[number];

export const LITERAL_TRUE = "t.literal(true)";
export const LITERAL_FALSE = "t.literal(false)";
export const REGULAR_UNDEFINED = `t.regular("undefined")`;
