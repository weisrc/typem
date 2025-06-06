import type { Format, Maximum, Minimum, Pattern } from "typem";
import { predicate } from "@typem/predicate";
import assert from "assert";

type User = {
  id: string & Format<"uuid">;
  name: string;
  /** @format email */
  email: string;
  age: number & Minimum<1> & Maximum<99>;
  phone?: string & Pattern<"phone", "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$">;
  friends: User[];
};

const isUser = predicate<User>();

const alice = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  name: "Alice",
  email: "alice@example.org",
  age: 30,
  phone: "(123)456-7890",
  friends: [],
};

assert(isUser(alice) === true);
