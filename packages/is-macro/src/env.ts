import type { Env, GeneralType, SpecialType } from "type-macro";
import type { Is, IsMacro } from ".";
export * from "./tags";

export function entry<T>(t: Is<T>) {
  return (() => t) as IsMacro;
}

export function error(message: string): any {
  throw new Error(message);
}

export function general<T>(type: GeneralType) {
  return ((x: any) => {
    return typeof x === type;
  }) as Is<T>;
}

export function special<T>(type: SpecialType) {
  if (type === "any" || type === "unknown") {
    return (() => true) as unknown as Is<T>;
  } else if (type === "void") {
    return ((x: any) => x === undefined) as Is<T>;
  }
  throw new Error(`Unsupported special type: ${type}`);
}

export function literal<T>(value: T) {
  return ((x: any) => {
    return x === value;
  }) as Is<any>;
}

export function optional<T>(type: Is<T>) {
  return ((x: any) => {
    if (x === undefined) {
      return true;
    }
    return type(x);
  }) as Is<T>;
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
        return false;
      }
    }
    for (const key in shape) {
      if (!(key in x)) {
        continue;
      }
      if (!shape[key](x[key])) {
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
    for (const item of x) {
      if (!type(item)) {
        return false;
      }
    }
    return true;
  }) as Is<T[]>;
}

export function union<T>(...types: Is<T>[]): Is<T> {
  return ((x: any) => {
    for (const type of types) {
      if (type(x)) {
        return true;
      }
    }
    return false;
  }) as Is<T>;
}

export function intersection<T>(...types: Is<T>[]): Is<T> {
  return ((x: any) => {
    for (const type of types) {
      if (!type(x)) {
        return false;
      }
    }
    return true;
  }) as Is<T>;
}

const verified = new WeakMap<Is<any>, WeakSet<any>>();

export function recursive<T>(fn: (self: Is<T>) => Is<T>): Is<T> {
  let type: Is<T>;
  const inner = (x: any) => {
    if (verified.has(type)) {
      const set = verified.get(type)!;
      if (set.has(x)) {
        return true;
      }
    }

    if (!verified.has(type)) {
      verified.set(type, new WeakSet());
    }
    const set = verified.get(type)!;
    set.add(x);

    return type(x);
  };
  type = fn(inner as Is<T>);
  return type;
}

export function tuple<T extends any[]>(...types: Is<T[number]>[]): Is<T> {
  return ((x: any) => {
    if (!Array.isArray(x) || x.length !== types.length) {
      return false;
    }
    for (let i = 0; i < types.length; i++) {
      if (!types[i](x[i])) {
        return false;
      }
    }
    return true;
  }) as Is<T>;
}

export function callable(): Is<never> {
  throw new Error("Cannot validate callable types");
}

export const env: Env<IsMacro, Is<any>> = {
  entry,
  error,
  array,
  general,
  intersection,
  literal,
  object,
  recursive,
  special,
  union,
  tuple,
  callable,
};
