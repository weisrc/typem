import { macro } from "typem/macro";
import { context } from "./context";

export type Predicate<T> = (x: any) => x is T;
export type PredicateMacro = <T>() => Predicate<T>;
export const predicate = macro<PredicateMacro, "@typem/predicate/env">();

export function withErrors<T>(is: Predicate<T>): Predicate<T> {
  return (x: any) => {
    context.enableErrors = true;
    context.errors = [];
    try {
      const result = is(x);
      context.enableErrors = false;
      return result;
    } catch (e) {
      context.errors = [];
      context.path = [];
      context.enableErrors = false;
      throw e;
    }
  };
}

export function getErrors() {
  return context.errors;
}

export function strict<T>(is: Predicate<T>): Predicate<T> {
  return (x: any) => {
    const previous = context.additionalProperties;
    context.additionalProperties = false;
    const result = is(x);
    context.additionalProperties = previous;
    return result;
  };
}

export function useStrict() {
  context.additionalProperties = false;
}
