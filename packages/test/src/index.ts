import { is, type Email, type Range } from "is-macro";

type User = Readonly<{
  name: string;
  age: number & Range<1, 100>;
  email: string & Email;
  color?: "red" | "green" | "blue";
  numbers: [number, number, number];
  test(): Promise<123>;
}>;


const isUser = is<User>();

console.log(
  isUser({
    name: "John",
    age: 1,
    email: "john@example.org",
    color: "red",
  })
); // true
