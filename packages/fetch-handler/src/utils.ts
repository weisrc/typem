export function mapObjectValues<
  T extends Record<string, any>,
  U extends Record<string, any>
>(obj: T, mapFn: (value: T[keyof T], key: keyof T) => U[keyof U]): U {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, mapFn(value, key)])
  ) as U;
}
