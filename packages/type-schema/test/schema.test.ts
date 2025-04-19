import { expect, it } from "bun:test";
import { schema } from "../src";

it("it should generate schema", () => {
  type User = {
    id: number;
    name: string;
    age: number;
    email: string;
    isActive: boolean;
  };

  const userSchema = schema<User>();

  expect(userSchema()).toEqual({
    type: "object",
    properties: {
      id: { type: "number" },
      name: { type: "string" },
      age: { type: "number" },
      email: { type: "string" },
      isActive: { type: "boolean" },
    },
    required: ["id", "name", "age", "email", "isActive"],
  });
});
