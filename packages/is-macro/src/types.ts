export type Is<T> = (x: any) => x is T;
export type IsMacro = <T>(t: T) => Is<T>;
