import { predicate } from "@typem/predicate";
import assert from "assert";

type Dog = {
  type: "dog";
  breed: "bulldog" | "beagle" | "poodle";
  age: number;
};

type Cat = {
  type: "cat";
  breed: "persian" | "siamese" | "maine";
  age: number;
};

type Pet = Dog | Cat;

const isPet = predicate<Pet>();
assert(isPet({ type: "dog", breed: "bulldog", age: 5 }) === true);
assert(isPet({ type: "dog", breed: "bulldog", age: "5" }) === false);
assert(isPet({ type: "cat", breed: "bulldog" }) === false);
