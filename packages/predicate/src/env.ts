import type { Env, GeneralType, SpecialType } from "typem/macro";
import type { Predicate, PredicateMacro } from ".";
import { additionalProperties } from "./annotations-env";
import {
  context,
  errorPathPop,
  errorPathPush,
  errorAdd,
  errorClear,
  resetVisited,
} from "./context";
export * from "./annotations-env";
export * from "./custom-env";

export function entry<T>(t: Predicate<T>) {
  return (() => (x) => {
    resetVisited();
    return t(x);
  }) as PredicateMacro;
}

export function error(message: string): any {
  throw new Error(message);
}

export function general<T>(type: GeneralType) {
  return ((x: any) => {
    if (typeof x === type) {
      return true;
    }
    errorAdd("invalid-type", type);
    return false;
  }) as Predicate<T>;
}

export function special<T>(type: SpecialType) {
  if (type === "any" || type === "unknown") {
    return (() => true) as unknown as Predicate<T>;
  } else if (type === "void") {
    return ((x: any) => {
      if (x === undefined) {
        return true;
      }
      errorAdd("invalid-value", undefined);
      return false;
    }) as Predicate<T>;
  }
  throw new Error(`Unsupported special type: ${type}`);
}

export function literal<T>(value: T) {
  return ((x: any) => {
    if (x === value) {
      return true;
    }
    errorAdd("invalid-value", value);
    return false;
  }) as Predicate<any>;
}

export function object<T extends object>(
  shape: {
    [key in keyof T]: Predicate<T[key]>;
  },
  required: (keyof T)[]
): Predicate<T> {
  return ((x: any) => {
    if (typeof x !== "object" || x === null) {
      errorAdd("invalid-type", "object");
      return false;
    }
    let ok = true;
    for (const key of required) {
      if (!(key in x)) {
        errorAdd("missing-property", key);
        ok = false;
        if (context.firstErrorOnly) {
          return ok;
        }
      }
    }
    if (!context.additionalProperties) {
      for (const key in x) {
        if (!(key in shape)) {
          errorAdd("additional-property", key);
          ok = false;
          if (context.firstErrorOnly) {
            return ok;
          }
        }
      }
    }
    for (const key in shape) {
      if (!(key in x)) {
        continue;
      }
      const previous = context.additionalProperties;
      context.additionalProperties = context.defaultAdditionalProperties;
      errorPathPush(key);
      const innerOk = shape[key](x[key]);
      errorPathPop();
      context.additionalProperties = previous;
      if (!innerOk) {
        ok = false;
        if (context.firstErrorOnly) {
          return ok;
        }
      }
    }
    return ok;
  }) as Predicate<T>;
}

export function union<T>(types: Predicate<T>[]): Predicate<T> {
  return ((x: any) => {
    for (const type of types) {
      if (type(x)) {
        errorClear();
        return true;
      }
    }
    return false;
  }) as Predicate<T>;
}

export function discriminatedUnion<T>(
  path: string,
  values: any[],
  types: Predicate<T>[]
): Predicate<T> {
  const map = new Map<any, Predicate<T>>();
  for (let i = 0; i < types.length; i++) {
    map.set(values[i], types[i]);
  }

  return ((x: any) => {
    if (typeof x !== "object" || x === null) {
      return false;
    }
    const type = map.get(x[path]);
    if (!type) {
      return false;
    }
    return type(x);
  }) as Predicate<T>;
}

export function intersection<T>(types: Predicate<T>[]): Predicate<T> {
  const inner = (x: any) => {
    let ok = true;
    for (const type of types) {
      if (!type(x)) {
        ok = false;
        if (context.firstErrorOnly) {
          return ok;
        }
      }
    }
    return ok;
  };
  return additionalProperties(inner as Predicate<any>, true) as Predicate<T>;
}

export function recursive<T>(
  fn: (self: Predicate<T>) => Predicate<T>
): Predicate<T> {
  let type: Predicate<T>;

  const inner = (x: any) => {
    let set = context.visited.get(type);
    if (set) {
      if (set.has(x)) {
        return true;
      }
    } else {
      set = new WeakSet();
      context.visited.set(type, set);
    }
    set.add(x);
    return type(x);
  };

  type = fn(inner as Predicate<T>);
  return type;
}

export function callable(): Predicate<never> {
  throw new Error("Cannot validate callable types");
}

export function record<K extends string, V>(
  key: Predicate<K>,
  value: Predicate<V>
): Predicate<Record<K, V>> {
  const isObject = general<any>("object");
  return ((x: any) => {
    if (!isObject(x)) {
      return false;
    }
    let ok = true;

    for (const k in x) {
      errorPathPush(k);
      errorPathPush(true);
      const keyOk = key(k);
      errorPathPop();
      errorPathPop();

      if (!keyOk) {
        ok = false;
        if (context.firstErrorOnly) {
          return ok;
        }
        continue;
      }

      errorPathPush(k);
      const valueOk = value(x[k]);
      errorPathPop();

      if (!valueOk) {
        ok = false;
        if (context.firstErrorOnly) {
          return ok;
        }
      }
    }
    return ok;
  }) as Predicate<Record<K, V>>;
}

export function optional<T>(type: Predicate<T>): Predicate<T | undefined> {
  return ((x: any) => x === undefined || type(x)) as Predicate<T | undefined>;
}

const env: Env<PredicateMacro, Predicate<any>> = {
  entry,
  error,
  general,
  record,
  intersection,
  literal,
  object,
  recursive,
  special,
  union,
  discriminatedUnion,
  callable,
  optional,
};
