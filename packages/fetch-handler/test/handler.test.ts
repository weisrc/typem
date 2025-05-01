import { it } from "bun:test";
import type { Format, FromParam, FromQuery } from "typem";
import { bootstrap, fetchHandler, type RequestWithParams } from "../src";
import type { OpenAPIV3_1 } from "openapi-types";

it("it works", () => {
  bootstrap();

  const hello = (
    name: string & FromQuery<"name">,
    req: RequestWithParams
  ) => {
    console.log(req);
    return `Hello ${name} ${req.url}`;
  };

  const getHelloSchema = fetchHandler(hello);

  const docs: OpenAPIV3_1.OperationObject = {
    operationId: "getHello",
  };

  const req = new Request(
    "http://localhost:3000/hello?name=world"
  ) as RequestWithParams;

  console.log(getHelloSchema.handler(req));

  getHelloSchema.docsUpdater(docs);

  console.log(JSON.stringify(docs, null, 2));
});
