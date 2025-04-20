import type { Is, Schema } from "type-schema";

export type Merged<T> = { is: Is<T>; schema: Schema<T> };

import { macro, type Tag } from "type-macro";
import { registerFromRequestHandler } from "./context";

export type HandlerFunction = (...args: any[]) => any;

export type Handler<_T extends HandlerFunction> = {
  run: (request: Request) => Response;
  schema: any;
};

export type FromRequest<Id extends string, Arg> = Tag<"fromRequest", [Id, Arg]>;

export type FromParam<Name extends string> = FromRequest<"fromParam", Name>;

export type HandlerMacro = <T extends HandlerFunction>(fn: T) => Handler<T>;

export const handler = macro<HandlerMacro, "gare/macro-env">();

export function bootstrap() {
  registerFromRequestHandler<FromParam<string>>(
    "fromParam",
    (request, name) => {
      return "hello world";
    }
  );
}
