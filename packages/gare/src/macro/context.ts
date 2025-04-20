import type { FromRequest } from ".";

export const fromRequestHandlers: Record<
  string,
  (request: Request, param: any) => any
> = {};

export function registerFromRequestHandler<T extends FromRequest<string, any>>(
  name: T extends FromRequest<infer N, any> ? N : never,
  handler: (
    request: Request,
    param: T extends FromRequest<any, infer A> ? A : never
  ) => any
): void {
  if (fromRequestHandlers[name]) {
    throw new Error(`Extractor ${name} already registered`);
  }
  fromRequestHandlers[name] = handler;
}
