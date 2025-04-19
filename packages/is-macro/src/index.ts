import { macro } from "type-macro";
import { context } from "./context";

export const is = macro<IsMacro, "is-macro/env">();
export type Is<T> = (x: any) => x is T;
export type IsMacro = <T>() => Is<T>;

export function withErrors<T>(is: Is<T>): Is<T> {
  return (x: any) => {
    context.enableErrors = true;
    context.errors = [];
    const result = is(x);
    context.enableErrors = false;
    return result;
  };
}

export function getErrors() {
  return context.errors;
}

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
