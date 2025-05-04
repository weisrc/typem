import { predicate, withErrors, getErrors } from "@typem/predicate";

const isString = predicate<string>();
console.log(isString("hello")); // true

const isStringWithErrors = withErrors(isString);
console.log(isStringWithErrors("hello")); // true
console.log(isStringWithErrors(123)); // false
console.log(getErrors());
/*
[
  {
    type: "invalid-type",
    target: "string",
    path: [],
  }
]
*/
