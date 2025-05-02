import type {
  FromJson,
  FromHeader,
  FromParam,
  FromQuery,
  FromRequest,
} from "typem";
import type { OperationSchema, HandlerRequest, Extractor } from "./types";

export const paramExtractor: Extractor<FromParam<string>> = {
  id: "param",
  extract(request: HandlerRequest, param: string) {
    return request.params?.[param];
  },
  updateSchema(
    operationSchema: OperationSchema,
    param: string,
    dataSchema: any
  ): void {
    operationSchema.parameters = [
      ...(operationSchema.parameters ?? []),
      {
        in: "path",
        name: param,
        schema: dataSchema,
        required: true,
      },
    ];
  },
};

export const queryExtractor: Extractor<FromQuery<string>> = {
  id: "query",
  extract(request: HandlerRequest, query: string) {
    request.urlObject ??= new URL(request.url);
    return request.urlObject.searchParams.get(query) ?? undefined;
  },
  updateSchema(
    operationSchema: OperationSchema,
    query: string,
    dataSchema: any
  ): void {
    operationSchema.parameters = [
      ...(operationSchema.parameters ?? []),
      {
        in: "query",
        name: query,
        schema: dataSchema,
      },
    ];
  },
};

export const headerExtractor: Extractor<FromHeader<string>> = {
  id: "header",
  extract(request: HandlerRequest, header: string) {
    return request.headers.get(header);
  },
  updateSchema(
    operationSchema: OperationSchema,
    header: string,
    dataSchema: any
  ): void {
    operationSchema.parameters = [
      ...(operationSchema.parameters ?? []),
      {
        in: "header",
        name: header,
        schema: dataSchema,
      },
    ];
  },
};

export const jsonExtractor: Extractor<FromJson> = {
  id: "json",
  async extract(request: HandlerRequest) {
    return await request.json();
  },
  updateSchema(
    operationSchema: OperationSchema,
    _: any,
    dataSchema: any
  ): void {
    operationSchema.requestBody = {
      content: {
        "application/json": {
          schema: dataSchema,
        },
      },
    };
  },
};

export const requestExtractor: Extractor<FromRequest> = {
  id: "request",
  extract(request: HandlerRequest) {
    return request;
  },
  updateSchema(): void {},
};
