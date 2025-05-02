import { expect, it } from "bun:test";
import type {
  Default,
  Deprecated,
  Description,
  Maximum,
  MaxItems,
  Minimum,
  ReferenceId,
  Title,
} from "typem";
import { jsonSchema } from "../src";

it("it should generate schema", () => {
  type User = {
    id: number;
    name: string & Deprecated;
    age: number & Minimum<0> & Maximum<100>;
    email: string;
    isActive: boolean;
    friends: User[] & Default<[]> & MaxItems<10>;
  } & Title<"User"> &
    Description<"User Schema"> &
    ReferenceId<"user">;

  const getUserSchema = jsonSchema<User>();

  expect(getUserSchema()).toEqual({
    $id: "user",
    title: "User",
    description: "User Schema",
    type: "object",
    properties: {
      id: { type: "number" },
      name: { type: "string", deprecated: true },
      age: { type: "number", minimum: 0, maximum: 100 },
      email: { type: "string" },
      isActive: { type: "boolean" },
      friends: {
        type: "array",
        items: { $ref: "user" },
        default: [],
        maxItems: 10,
      },
    },
    required: ["id", "name", "age", "email", "isActive", "friends"],
  });
});
