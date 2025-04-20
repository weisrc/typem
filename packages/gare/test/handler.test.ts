import { it, expect } from "bun:test";
import { bootstrap, handler, type FromParam } from "../src/macro";

it("it should generate schema", () => {
  bootstrap();
  function hello(name: number & FromParam<"name">) {
    return `Hello ${name}`;
  }

  const getHelloSchema = handler(hello);

  console.log(getHelloSchema.run(new Request("http://localhost:3000/hello?name=world")));
});
