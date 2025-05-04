import { predicate, withErrors, getErrors } from "@typem/predicate";
import { assert } from "console";

const isString = predicate<string>();
assert(isString("hello") === true);

const isStringWithErrors = withErrors(isString);
assert(isStringWithErrors("hello") === true);
assert(isStringWithErrors(123) === false);
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
