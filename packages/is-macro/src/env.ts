import type { Env, GeneralType, SpecialType } from "type-macro";
import type { Is, IsMacro } from ".";
import { additionalProperties } from "./tags";
import {
  context,
  errorPathPop,
  errorPathPush,
  errorAdd,
  errorClear,
} from "./context";
export * from "./tags";

export function entry<T>(t: Is<T>) {
  return (() => t) as IsMacro;
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
  }) as Is<T>;
}

export function special<T>(type: SpecialType) {
  if (type === "any" || type === "unknown") {
    return (() => true) as unknown as Is<T>;
  } else if (type === "void") {
    return ((x: any) => {
      if (x === undefined) {
        return true;
      }
      errorAdd("invalid-value", undefined);
      return false;
    }) as Is<T>;
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
  }) as Is<any>;
}

export function object<T extends object>(
  shape: {
    [key in keyof T]: Is<T[key]>;
  },
  required: string[]
): Is<T> {
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
  }) as Is<T>;
}

export function array<T>(type: Is<T>): Is<T[]> {
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
  }) as Is<T[]>;
}

export function union<T>(types: Is<T>[]): Is<T> {
  return ((x: any) => {
    for (const type of types) {
      if (type(x)) {
        errorClear();
        return true;
      }
    }
    return false;
  }) as Is<T>;
}

export function discriminatedUnion<T>(
  path: string,
  values: any[],
  types: Is<T>[]
): Is<T> {
  const map = new Map<any, Is<T>>();
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
  }) as Is<T>;
}

export function intersection<T>(types: Is<T>[]): Is<T> {
  const inner = (x: any) => {
    for (const type of types) {
      if (!type(x)) {
        return false;
      }
    }
    return true;
  };
  return additionalProperties(inner as Is<any>, true) as Is<T>;
}

const visited = new WeakMap<Is<any>, WeakSet<any>>();

export function recursive<T>(fn: (self: Is<T>) => Is<T>): Is<T> {
  let type: Is<T>;
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
  type = fn(inner as Is<T>);
  return type;
}

export function tuple<T extends any[]>(...types: Is<T[number]>[]): Is<T> {
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
  }) as Is<T>;
}

export function callable(): Is<never> {
  throw new Error("Cannot validate callable types");
}

export function record<K extends string, V>(
  key: Is<K>,
  value: Is<V>
): Is<Record<K, V>> {
  const isObject = general<any>("object");
  return ((x: any) => {
    if (!isObject(x)) {
      return false;
    }
    for (const k in x) {
      errorPathPush(k);
      const keyOk = key(k);
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
  }) as Is<Record<K, V>>;
}

export const env: Env<IsMacro, Is<any>> = {
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
