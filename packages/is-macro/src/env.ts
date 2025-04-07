import { Is } from "./types";

export function entry<T>(fn: Is<T>) {
  return (x: any) => fn;
}

export function regular<T>(type: string) {
  return ((x: any) => {
    return typeof x === type;
  }) as Is<T>;
}

export function literal<T>(value: T) {
  return (x: any) => {
    return x === value;
  };
}

export function optional<T>(type: Is<T>) {
  return ((x: any) => {
    if (x === undefined) {
      return true;
    }
    return type(x);
  }) as Is<T>;
}

export function object<T extends object>(shape: {
  [key in keyof T]: Is<T[key]>;
}): Is<T> {
  return ((x: any) => {
    if (typeof x !== "object" || x === null) {
      return false;
    }
    for (const key in shape) {
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

export function interection<T>(...types: Is<T>[]): Is<T> {
  return ((x: any) => {
    for (const type of types) {
      if (!type(x)) {
        return false;
      }
    }
    return true;
  }) as Is<T>;
}

export function recursive<T>(fn: (self: Is<T>) => Is<T>): Is<T> {
  let type: Is<T>;
  const isType = (x: any) => {
    return type(x);
  };
  type = fn(isType);
  return type;
}
