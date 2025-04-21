import { it } from "bun:test";
import type { Format, FromParam } from "typem";
import { bootstrap, fetchHandler, type RequestContext } from "../src";
import type { OpenAPIV3_1 } from "openapi-types";

it("it works", () => {
  bootstrap();

  const hello = (name: string & Format<"email"> & FromParam<"name">) => {
    return `Hello ${name}`;
  };

  const getHelloSchema = fetchHandler(hello);

  const docs: OpenAPIV3_1.OperationObject = {
    operationId: "getHello",
  };

  const ctx: RequestContext = {
    request: new Request("http://localhost:3000/hello?name=world"),
    params: {
      name: "test@example.org",
    },
  };

  console.log(getHelloSchema.handler(ctx));

  getHelloSchema.docsUpdater(docs);

  console.log(JSON.stringify(docs, null, 2));
});
