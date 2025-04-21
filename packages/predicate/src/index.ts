import { macro } from "typem/macro";
import { context } from "./context";

export type Predicate<T> = (x: any) => x is T;
export type PredicateMacro = <T>() => Predicate<T>;
export const predicate = macro<PredicateMacro, "@typem/predicate/env">();

export function withErrors<T>(is: Predicate<T>): Predicate<T> {
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
