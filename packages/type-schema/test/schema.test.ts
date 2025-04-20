import { expect, it } from "bun:test";
import { schema } from "../src";

it("it should generate schema", () => {
  type User = {
    id: number;
    name: string;
    age: number;
    email: string;
    isActive: boolean;
    friends: User[];
  };

  const getUserSchema = schema<User>();

  expect(getUserSchema()).toEqual({
    $id: "recursive",
    type: "object",
    properties: {
      id: { type: "number" },
      name: { type: "string" },
      age: { type: "number" },
      email: { type: "string" },
      isActive: { type: "boolean" },
      friends: {
        type: "array",
        items: { $ref: "recursive" },
      },
    },
    required: ["id", "name", "age", "email", "isActive", "friends"],
  });
});
