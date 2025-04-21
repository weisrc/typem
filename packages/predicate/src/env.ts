import type { Env, GeneralType, SpecialType } from "typem/macro";
import type { Predicate, PredicateMacro } from ".";
import { additionalProperties } from "./annotations-env";
import {
  context,
  errorPathPop,
  errorPathPush,
  errorAdd,
  errorClear,
} from "./context";
export * from "./annotations-env";

export function entry<T>(t: Predicate<T>) {
  return (() => t) as PredicateMacro;
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
  required: string[]
): Predicate<T> {
  return ((x: any) => {
    if (typeof x !== "object" || x === null) {
      return false;
    }
    for (const key of required) {
      if (!(key in x)) {
        errorAdd("missing-property", key);
        return false;
      }
    }
    if (!context.additionalProperties) {
      for (const key in x) {
        if (!(key in shape)) {
          errorAdd("additional-property", key);
          return false;
        }
      }
    }
    for (const key in shape) {
      if (!(key in x)) {
        continue;
      }
      errorPathPush(key);
      const ok = shape[key](x[key]);
      errorPathPop();
      if (!ok) {
        return false;
      }
    }
    return true;
  }) as Predicate<T>;
}

export function array<T>(type: Predicate<T>): Predicate<T[]> {
  return ((x: any) => {
    if (!Array.isArray(x)) {
      return false;
    }
    for (let i = 0; i < x.length; i++) {
      const item = x[i];
      errorPathPush(i);
      const ok = type(item);
      errorPathPop();
      if (!ok) {
        return false;
      }
    }
    return true;
  }) as Predicate<T[]>;
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
    for (const type of types) {
      if (!type(x)) {
        return false;
      }
    }
    return true;
  };
  return additionalProperties(inner as Predicate<any>, true) as Predicate<T>;
}

const visited = new WeakMap<Predicate<any>, WeakSet<any>>();

export function recursive<T>(fn: (self: Predicate<T>) => Predicate<T>): Predicate<T> {
  let type: Predicate<T>;
  const inner = (x: any) => {
    if (visited.has(type)) {
      const set = visited.get(type)!;
      if (set.has(x)) {
        return true;
      }
    }

    if (!visited.has(type)) {
      visited.set(type, new WeakSet());
    }
    const set = visited.get(type)!;
    set.add(x);

    return type(x);
  };
  type = fn(inner as Predicate<T>);
  return type;
}

export function tuple<T extends any[]>(...types: Predicate<T[number]>[]): Predicate<T> {
  return ((x: any) => {
    if (!Array.isArray(x)) {
      errorAdd("invalid-type", "array");
      return false;
    }
    if (x.length !== types.length) {
      errorAdd("invalid-size", types.length);
      return false;
    }
    for (let i = 0; i < types.length; i++) {
      errorPathPush(i);
      const ok = types[i](x[i]);
      errorPathPop();
      if (!ok) {
        return false;
      }
    }
    return true;
  }) as Predicate<T>;
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
    for (const k in x) {
      errorPathPush(k);
      errorPathPush(true);
      const keyOk = key(k);
      errorPathPop();
      errorPathPop();

      if (!keyOk) {
        return false;
      }

      errorPathPush(k);
      const valueOk = value(x[k]);
      errorPathPop();

      if (!valueOk) {
        return false;
      }
    }
    return true;
  }) as Predicate<Record<K, V>>;
}

export const env: Env<PredicateMacro, Predicate<any>> = {
  entry,
  error,
  array,
  general,
  record,
  intersection,
  literal,
  object,
  recursive,
  special,
  union,
  discriminatedUnion,
  tuple,
  callable,
};
