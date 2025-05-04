import {
  getErrors,
  predicate,
  setFirstErrorOnly,
  withErrors,
} from "@typem/predicate";
import { afterEach, beforeEach, expect, it } from "bun:test";
import type { Format } from "typem";

beforeEach(() => {
  setFirstErrorOnly(false);
});

afterEach(() => {
  setFirstErrorOnly(true);
});

it("multiple errors on object", () => {
  type Person = {
    name: string;
    age: number;
  };

  const isPerson = withErrors(predicate<Person>());

  expect(isPerson({ name: "John", age: 30 })).toBe(true);
  expect(getErrors()).toEqual([]);
  expect(isPerson({ name: 123 })).toBe(false);
  expect(getErrors()).toEqual([
    {
      type: "missing-property",
      target: "age",
      path: [],
    },
    {
      type: "invalid-type",
      target: "string",
      path: ["name"],
    },
  ]);
});

it("multiple errors on array", () => {
  const isArray = withErrors(predicate<number[]>());

  expect(isArray([1, 2, 3])).toBe(true);
  expect(getErrors()).toEqual([]);
  expect(isArray([1, "2", "3"])).toBe(false);
  expect(getErrors()).toEqual([
    {
      type: "invalid-type",
      target: "number",
      path: [1],
    },
    {
      type: "invalid-type",
      target: "number",
      path: [2],
    },
  ]);
});

it("multiple errors on tuple", () => {
  const isTuple = withErrors(predicate<[number, string]>());

  expect(isTuple([1, "2"])).toBe(true);
  expect(getErrors()).toEqual([]);
  expect(isTuple(["1", 2])).toBe(false);
  expect(getErrors()).toEqual([
    {
      type: "invalid-type",
      target: "number",
      path: [0],
    },
    {
      type: "invalid-type",
      target: "string",
      path: [1],
    },
  ]);
});

it("multiple errors on union", () => {
  const isUnion = withErrors(predicate<number | string>());

  expect(isUnion(123)).toBe(true);
  expect(getErrors()).toEqual([]);
  expect(isUnion("123")).toBe(true);
  expect(getErrors()).toEqual([]);
  expect(isUnion(true)).toBe(false);
  expect(getErrors()).toEqual([
    {
      type: "invalid-type",
      target: "string",
      path: [],
    },
    {
      type: "invalid-type",
      target: "number",
      path: [],
    },
  ]);
});

it("multiple errors on record", () => {
  const isRecord = withErrors(
    predicate<Record<string & Format<"ipv4">, number>>()
  );

  expect(isRecord({ "1.2.3.4": 1, "1.1.1.1": 2 })).toBe(true);
  expect(getErrors()).toEqual([]);
  expect(isRecord({ "1.1.1.1": "1", b: "2" })).toBe(false);
  expect(getErrors()).toEqual([
    {
      type: "invalid-type",
      target: "number",
      path: ["1.1.1.1"],
    },
    {
      type: "invalid-format",
      target: "ipv4",
      path: ["b", true],
    },
  ]);
});
