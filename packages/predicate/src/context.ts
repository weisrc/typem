import type { Predicate } from ".";

export type Context = {
  additionalProperties: boolean;
  enableErrors: boolean;
  path: (string | number | boolean)[];
  errors: ValidationError[];
  visited: WeakMap<Predicate<any>, WeakSet<any>>;
};

export type ValidationErrorType =
  | "missing-property"
  | "additional-property"
  | "invalid-type"
  | "invalid-value"
  | "invalid-format"
  | "invalid-size"
  | "minimum"
  | "maximum"
  | "exclusive-minimum"
  | "exclusive-maximum"
  | "multiple-of"
  | "unique-items"
  | "max-items"
  | "min-items"
  | "max-length"
  | "min-length"
  | "max-properties"
  | "min-properties";

export const context: Context = {
  additionalProperties: true,
  enableErrors: false,
  path: [],
  errors: [],
  visited: new WeakMap<Predicate<any>, WeakSet<any>>(),
};

export function resetVisited() {
  context.visited = new WeakMap<Predicate<any>, WeakSet<any>>()
}

export type ValidationError = {
  type: ValidationErrorType;
  target: any;
  path: (string | number | boolean)[];
  key?: true;
};

export function errorPathPush(part: string | number | boolean) {
  if (context.enableErrors) {
    context.path.push(part);
  }
}

export function errorPathPop() {
  if (context.enableErrors) {
    context.path.pop();
  }
}

export function errorAdd(type: ValidationErrorType, target: any) {
  if (context.enableErrors) {
    context.errors.push({ type, target, path: [...context.path] });
  }
}

export function errorClear() {
  if (context.enableErrors) {
    context.errors = [];
  }
}
