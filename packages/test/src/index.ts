import { is, type Email } from "is-macro";

function hello(name: string) {
  return `Hello ${name}`;
}

const isUser = is(hello);

console.log(
  isUser({
    name: "John",
    manager: {
      name: "Jane",
      another: true,
    },
  })
); // true
