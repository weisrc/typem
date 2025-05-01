import { it } from "bun:test";
import type { FromQuery } from "typem";
import { bootstrap, handler, type RequestWithParams } from "../src";

it("it works", () => {
  bootstrap();

  function hello(name: string & FromQuery<"name">, req: RequestWithParams) {
    return {
      name,
      time: Date.now(),
      pets: ["bob", "jerry"],
      url: req.url
    };
  }

  const helloHandler = handler(hello);

  const req = new Request("http://localhost:3000/hello?name=world");

  console.log(helloHandler(req));
  console.log(JSON.stringify(helloHandler.schema, null, 2));
});
