export function macro<T, P extends string>() {
  return (() => {
    throw new Error("Not implemented");
  }) as unknown as T & {
    __macro: P;
  };
}

export type Annotation<P> = {
  __annotation?: P;
};

export type MacroEnv<T> = {
  string: T;
  number: T;
  boolean: T;
}