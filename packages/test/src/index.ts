import { is } from "is-macro";

const isUser = is<{
  name: string;
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
