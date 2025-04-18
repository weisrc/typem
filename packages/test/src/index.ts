import { is, type Format } from "is-macro";

type A = {
  [x: string & Format<"email">]: number;
} & {
  hello: "world";
};

const check = is<A>();

console.log(
  check({
    a: 1,
    b: false,
  })
); // true
