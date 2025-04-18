import { it, expect } from "bun:test";

import { is } from "../src";

it("should validate objects", () => {
  const isObject = is<{ name: string; age: number }>();

  expect(isObject({ name: "John", age: 30 })).toBe(true);
  expect(isObject({ name: "John" })).toBe(false);
  expect(isObject({ age: 30 })).toBe(false);
  expect(isObject({ name: "John", age: "30" })).toBe(false);
  expect(isObject("John")).toBe(false);
});

it("should validate arrays", () => {
  const isArray = is<number[]>();

  expect(isArray([1, 2, 3])).toBe(true);
  expect(isArray([1, "2", 3])).toBe(false);
  expect(isArray("123")).toBe(false);
});

it("should validate tuples", () => {
  const isTuple = is<[number, string]>();

  expect(isTuple([1, "2"])).toBe(true);
  expect(isTuple([1, 2])).toBe(false);
  expect(isTuple([1])).toBe(false);
  expect(isTuple("123")).toBe(false);
});

it("should validate unions", () => {
  const isUnion = is<number | string>();

  expect(isUnion(123)).toBe(true);
  expect(isUnion("123")).toBe(true);
  expect(isUnion(true)).toBe(false);
});

it("should validate intersections", () => {
  const isIntersection = is<{ name: string } & { age: number }>();

  expect(isIntersection({ name: "John", age: 30 })).toBe(true);
  expect(isIntersection({ name: "John" })).toBe(false);
  expect(isIntersection({ age: 30 })).toBe(false);
  expect(isIntersection("John")).toBe(false);
});

it("should validate optional properties", () => {
  const isOptional = is<{ name: string; age?: number }>();

  expect(isOptional({ name: "John" })).toBe(true);
  expect(isOptional({ name: "John", age: undefined })).toBe(false);
  expect(isOptional({ age: 30 })).toBe(false);
});
