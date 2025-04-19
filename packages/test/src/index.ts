import { is, type Format } from "is-macro";

type A = { type: "dog"; name: string } | { type: "cat"; age: number };

const check = is<A>();

console.log(
  check({
    a: 1,
    b: false,
  })
); // true
