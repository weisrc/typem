import type { Predicate } from ".";
import { errorAdd, errorPathPush, errorPathPop, context } from "./context";

export function tuple<T extends any[]>(
  ...types: Predicate<T[number]>[]
): Predicate<T> {
  return ((x: any) => {
    if (!Array.isArray(x)) {
      errorAdd("invalid-type", "array");
      return false;
    }
    if (x.length !== types.length) {
      errorAdd("invalid-size", types.length);
      return false;
    }
    let ok = true;
    for (let i = 0; i < types.length; i++) {
      errorPathPush(i);
      const innerOk = types[i](x[i]);
      errorPathPop();
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

export function array<T>(type: Predicate<T>): Predicate<T[]> {
  return ((x: any) => {
    if (!Array.isArray(x)) {
      errorAdd("invalid-type", "array");
      return false;
    }
    let ok = true;
    for (let i = 0; i < x.length; i++) {
      const item = x[i];
      errorPathPush(i);
      const innerOk = type(item);
      errorPathPop();
      if (!innerOk) {
        ok = false;
        if (context.firstErrorOnly) {
          return ok;
        }
      }
    }
    return ok;
  }) as Predicate<T[]>;
}

export function map<K, V>(
  keyType: Predicate<K>,
  valueType: Predicate<V>
): Predicate<Map<K, V>> {
  return ((x: any) => {
    if (!(x instanceof Map)) {
      errorAdd("invalid-type", "map");
      return false;
    }
    let ok = true;
    for (const [key, value] of x.entries()) {
      errorPathPush(key);
      const keyOk = keyType(key);
      errorPathPop();
      if (!keyOk) {
        ok = false;
        if (context.firstErrorOnly) {
          return ok;
        }
      }
      errorPathPush(value);
      const valueOk = valueType(value);
      errorPathPop();
      if (!valueOk) {
        ok = false;
        if (context.firstErrorOnly) {
          return ok;
        }
      }
    }
    return ok;
  }) as Predicate<Map<K, V>>;
}

export function set<T>(
  type: Predicate<T>
): Predicate<Set<T>> {
  return ((x: any) => {
    if (!(x instanceof Set)) {
      errorAdd("invalid-type", "set");
      return false;
    }
    let ok = true;
    for (const item of x) {
      errorPathPush(item);
      const innerOk = type(item);
      errorPathPop();
      if (!innerOk) {
        ok = false;
        if (context.firstErrorOnly) {
          return ok;
        }
      }
    }
    return ok;
  }) as Predicate<Set<T>>;
}

function makeInstanceOfPredicate<T>(
  type: new (...args: any[]) => T
): () => Predicate<T> {
  return () =>
    ((x: any) => {
      if (!(x instanceof type)) {
        errorAdd("invalid-type", type.name);
        return false;
      }
      return true;
    }) as Predicate<T>;
}

export const int8Array = makeInstanceOfPredicate(Int8Array);
export const uint8Array = makeInstanceOfPredicate(Uint8Array);
export const uint8ClampedArray = makeInstanceOfPredicate(Uint8ClampedArray);
export const int16Array = makeInstanceOfPredicate(Int16Array);
export const uint16Array = makeInstanceOfPredicate(Uint16Array);
export const int32Array = makeInstanceOfPredicate(Int32Array);
export const uint32Array = makeInstanceOfPredicate(Uint32Array);
export const float16Array = makeInstanceOfPredicate(Float16Array);
export const float32Array = makeInstanceOfPredicate(Float32Array);
export const float64Array = makeInstanceOfPredicate(Float64Array);
export const bigInt64Array = makeInstanceOfPredicate(BigInt64Array);
export const bigUint64Array = makeInstanceOfPredicate(BigUint64Array);
export const arrayBuffer = makeInstanceOfPredicate(ArrayBuffer);
export const sharedArrayBuffer = makeInstanceOfPredicate(SharedArrayBuffer);
export const dataView = makeInstanceOfPredicate(DataView);