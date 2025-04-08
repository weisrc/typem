import { is, type Email, type Range } from "is-macro";

type User = {
  name: string;
  age: number & Range<1, 100>;
  email: string & Email;
};

const isUser = is<User>();

console.log(
  isUser({
    name: "John",
    age: 1,
    email: "asdf@asdf.ca"
  })
); // true
