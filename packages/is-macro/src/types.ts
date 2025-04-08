export type Is<T> = (x: any) => x is T;
export type IsMacro = <T>() => Is<T>;
