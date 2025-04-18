import { macro } from "type-macro";

export const is = macro<IsMacro, "is-macro/env">();
export type Is<T> = (x: any) => x is T;
export type IsMacro = <T>() => Is<T>;

export type {
  ExclusiveMaximum,
  ExclusiveMinimum,
  Format,
  MaxItems,
  MaxLength,
  Maximum,
  MinItems,
  MinLength,
  Minimum,
  MultipleOf,
  Pattern,
  UniqueItems,
} from "./tags";
