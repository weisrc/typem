import type { FromInput, Custom } from "typem";
import {
  handler,
  HttpError,
  registerExtractor,
  type Extractor,
} from "@typem/fetch-handler";
import { it, expect } from "bun:test";

it("custom extractor", async () => {
  type AuthData = {
    user: string;
  } & Custom<"unit">;

  type Auth = AuthData & FromInput<"auth", []>;

  const authExtractor: Extractor<Auth> = {
    id: "auth",
    extract(request) {
      const user = request.headers.get("X-User");
      if (!user) {
        throw new HttpError(
          401,
          "User not authenticated",
          "user_not_authenticated"
        );
      }
      return { user };
    },
  };

  registerExtractor(authExtractor);

  function hello(auth: Auth) {
    return `Hello, ${auth.user}!`;
  }

  const helloHandler = handler(hello);

  const goodRequest = new Request("http://localhost:8080/hello", {
    headers: {
      "X-User": "alice",
    },
  });

  const response = await helloHandler(goodRequest);
  expect(response.status).toBe(200);
  expect(await response.text()).toBe(JSON.stringify("Hello, alice!"));

  const badRequest = new Request("http://localhost:8080/hello");
  const badResponse = await helloHandler(badRequest);
  expect(badResponse.status).toBe(401);
  expect(await badResponse.json()).toEqual({
    error: {
      code: "user_not_authenticated",
      message: "User not authenticated",
      details: undefined,
    },
  });
});
