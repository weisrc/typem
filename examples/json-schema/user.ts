import { jsonSchema } from "@typem/json-schema";
import type { Description, Format, ReferenceId, Title } from "typem";

type User = {
  /** @description uuid of the user */
  id: string & Format<"uuid">;
  name: string;
  /** @format email */
  email: string;
  /** @description age of the user */
  age?: number | boolean;
  friends: User[];
} & ReferenceId<"user"> &
  Title<"User"> &
  Description<"User Schema">;

const getUserSchema = jsonSchema<User>();
const userSchema = getUserSchema();
console.log(JSON.stringify(userSchema, null, 2));