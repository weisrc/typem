import { expect, it } from "bun:test";
import { handler, Reply, setup, type HandlerRequest } from "../src";
import type { Format, FromHeader, FromJson, FromParam, FromQuery } from "typem";

setup();

it("returns json", async () => {
  async function hello() {
    return "hello world";
  }

  const helloHandler = handler(hello);

  const req = new Request("http://localhost:3000/hello");

  expect(await (await helloHandler(req)).json()).toEqual("hello world");
});

it("returns reply", async () => {
  async function hello() {
    return new Reply("hello world");
  }
  const helloHandler = handler(hello);
  const req = new Request("http://localhost:3000/hello");
  const res = await helloHandler(req);
  expect(res).toBeInstanceOf(Response);
  expect(res.status).toEqual(200);
  expect(await res.text()).toEqual("hello world");
});

it("extracts query", async () => {
  async function hello(name: string & FromQuery<"name">) {
    return `hello ${name}`;
  }

  const helloHandler = handler(hello);

  const req = new Request("http://localhost:3000/hello?name=john");

  expect(await (await helloHandler(req)).json()).toEqual("hello john");
});

it("extracts param", async () => {
  async function hello(name: string & FromParam<"name">) {
    return `hello ${name}`;
  }

  const helloHandler = handler(hello);

  const req = new Request(
    "http://localhost:3000/hello/alice"
  ) as HandlerRequest;
  req.params = { name: "alice" };

  expect(await (await helloHandler(req)).json()).toEqual("hello alice");
});

it("extracts param and query", async () => {
  async function hello(
    name: string & FromParam<"name">,
    age: string & FromQuery<"age">
  ) {
    return `hello ${name}, you are ${age} years old`;
  }

  const helloHandler = handler(hello);

  expect(helloHandler.schema).toEqual({
    parameters: [
      {
        name: "name",
        in: "path",
        required: true,
        schema: { type: "string" },
      },
      {
        name: "age",
        in: "query",
        schema: { type: "string" },
      },
    ],
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: { type: "string" },
          },
        },
      },
    },
  });

  const req = new Request(
    "http://localhost:3000/hello/alice?age=30"
  ) as HandlerRequest;
  req.params = { name: "alice" };

  expect(await (await helloHandler(req)).json()).toEqual(
    "hello alice, you are 30 years old"
  );
});

it("extracts query with default", async () => {
  async function hello(name: string & FromQuery<"name"> = "world") {
    return `hello ${name}`;
  }

  const helloHandler = handler(hello);

  expect(helloHandler.schema).toEqual({
    parameters: [
      {
        name: "name",
        in: "query",
        schema: { type: "string" },
      },
    ],
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: { type: "string" },
          },
        },
      },
    },
  });

  const req = new Request("http://localhost:3000/hello?name=john");
  const res = await helloHandler(req);
  expect(res).toBeInstanceOf(Response);
  expect(res.status).toEqual(200);
  expect(await res.json()).toEqual("hello john");

  const req2 = new Request("http://localhost:3000/hello");
  const res2 = await helloHandler(req2);
  expect(res2).toBeInstanceOf(Response);
  expect(res2.status).toEqual(200);
  expect(await res2.json()).toEqual("hello world");
});

it("extracts json", async () => {
  async function hello(data: { name: string; age: number } & FromJson) {
    return `hello ${data.name}, you are ${data.age} years old`;
  }
  const helloHandler = handler(hello);

  expect(helloHandler.schema).toEqual({
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: { type: "string" },
              age: { type: "number" },
            },
            required: ["name", "age"],
          },
        },
      },
    },
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: { type: "string" },
          },
        },
      },
    },
  });

  const req = new Request("http://localhost:3000/hello", {
    method: "POST",
    body: JSON.stringify({ name: "john", age: 30 }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res = await helloHandler(req);
  expect(res).toBeInstanceOf(Response);
  expect(res.status).toEqual(200);
  expect(await res.json()).toEqual("hello john, you are 30 years old");

  const req2 = new Request("http://localhost:3000/hello", {
    method: "POST",
    body: JSON.stringify({ name: "john" }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res2 = await helloHandler(req2);
  expect(res2).toBeInstanceOf(Response);
  expect(res2.status).toEqual(400);
  expect(await res2.json()).toEqual({
    errors: [
      {
        path: [],
        target: "age",
        type: "missing-property",
      },
    ],
    extractor: {
      id: "json",
      param: [],
    },
  });
});

it("extracts header", async () => {
  async function hello(id: string & Format<"uuid"> & FromHeader<"x-id">) {
    return `hello, your id is ${id}`;
  }

  const id = "a294cc01-3bc8-4b4d-b9a5-61e955ca0dc0";

  const helloHandler = handler(hello);
  const req = new Request("http://localhost:3000/hello", {
    headers: {
      "x-id": id,
    },
  });
  const res = await helloHandler(req);
  expect(res).toBeInstanceOf(Response);
  expect(res.status).toEqual(200);
  expect(await res.json()).toEqual("hello, your id is " + id);
  expect(helloHandler.schema).toEqual({
    parameters: [
      {
        name: "x-id",
        in: "header",
        schema: { type: "string", format: "uuid" },
      },
    ],
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: { type: "string" },
          },
        },
      },
    },
  });

  const req2 = new Request("http://localhost:3000/hello", {
    headers: {
      "x-id": "invalid-uuid",
    },
  });
  const res2 = await helloHandler(req2);
  expect(res2).toBeInstanceOf(Response);
  expect(res2.status).toEqual(400);
  expect(await res2.json()).toEqual({
    errors: [
      {
        path: [],
        target: "uuid",
        type: "invalid-format",
      },
    ],
    extractor: {
      id: "header",
      param: "x-id",
    },
  });
});

it("extracts handler request", async () => {
  const url = "http://localhost:3000/hello/alice";

  async function hello(req: HandlerRequest) {
    return `your url is ${req.url}`;
  }

  const helloHandler = handler(hello);
  expect(helloHandler.schema).toEqual({
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: { type: "string" },
          },
        },
      },
    },
  });

  const req = new Request(url) as HandlerRequest;

  expect(await (await helloHandler(req)).json()).toEqual("your url is " + url);
});
