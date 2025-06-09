import type { FromInput, Custom } from "typem";
import {
  handler,
  HttpError,
  registerBaseExtractors,
  registerExtractor,
  type Extractor,
} from "@typem/fetch-handler";

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

registerBaseExtractors();
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

console.log(response.status); // 200
console.log(await response.text()); // "Hello, alice!"
