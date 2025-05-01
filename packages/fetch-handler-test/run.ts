import type { FromParam } from "typem";
import { bootstrap, handler } from "@typem/fetch-handler";

bootstrap();

function hello(name: string & FromParam<"name">) {
  return {
    message: "Hello, " + name,
  };
}

const helloHandler = handler(hello);

Bun.serve({
  routes: {
    "/hello/:name": helloHandler,
  },
  port: 8080,
});
