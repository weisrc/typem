import { handler, registerBaseExtractors } from "@typem/fetch-handler";
import type { FromQuery, MinLength } from "typem";

function hello(name: string & MinLength<3> & FromQuery<"name">) {
  return { message: `Hello, ${name}!` };
}

registerBaseExtractors();
const helloHandler = handler(hello);
console.log(helloHandler.schema); // OpenAPI Operation Schema

const goodRequest = new Request("http://localhost:8080/hello?name=alice");
const response = await helloHandler(goodRequest);
console.log(await response.json()); // { message: 'Hello, alice!' }

const badRequest = new Request("http://localhost:8080/hello?name=no");
const badResponse = await helloHandler(badRequest);
console.log(badResponse.status); // 400
console.log(await badResponse.json()); // min-length error
