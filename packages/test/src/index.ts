import { is, type Email } from "is-macro";

const isUser = is<{
  name: string;
  email: string & Email;
  another?: boolean;
  manager?: boolean;
}>(0 as any);

console.log(
  isUser({
    name: "John",
    manager: {
      name: "Jane",
      another: true,
    },
  })
); // true
