import { macro } from "typem/macro";
import { context, resetContext } from "./context";

export type { ValidationError } from "./context";

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
      resetContext();
      throw e;
    }
  };
}

export function getErrors() {
  return context.errors;
}

export function setDefaultAdditionalProperties(enabled: boolean) {
  context.defaultAdditionalProperties = enabled;
}

export function setFirstErrorOnly(enabled: boolean) {
  context.firstErrorOnly = enabled;
}
