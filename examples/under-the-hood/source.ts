import { predicate } from "@typem/predicate";

const isString = predicate<string>();

console.log(isString("hello"));