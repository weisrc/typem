import { it, expect } from "bun:test";

import { is } from "../src";
import type { AdditionalProperties } from "../src/tags";

it("should validate objects", () => {
  const check = is<{ name: string; age: number }>();

  expect(check({ name: "John", age: 30 })).toBe(true);
  expect(check({ name: "John" })).toBe(false);
  expect(check({ age: 30 })).toBe(false);
  expect(check({ name: "John", age: "30" })).toBe(false);
  expect(check("John")).toBe(false);
});

it("should validate arrays", () => {
  const check = is<number[]>();

  expect(check([1, 2, 3])).toBe(true);
  expect(check([1, "2", 3])).toBe(false);
  expect(check("123")).toBe(false);
});

it("should validate tuples", () => {
  const check = is<[number, string]>();

  expect(check([1, "2"])).toBe(true);
  expect(check([1, 2])).toBe(false);
  expect(check([1])).toBe(false);
  expect(check("123")).toBe(false);
});

it("should validate unions", () => {
  const check = is<number | string>();

  expect(check(123)).toBe(true);
  expect(check("123")).toBe(true);
  expect(check(true)).toBe(false);
});

it("should validate intersections", () => {
  const check = is<{ name: string } & { age: number }>();

  expect(check({ name: "John", age: 30 })).toBe(true);
  expect(check({ name: "John" })).toBe(false);
  expect(check({ age: 30 })).toBe(false);
  expect(check("John")).toBe(false);
});

it("should validate optional properties", () => {
  const check = is<{ name: string; age?: number }>();

  expect(check({ name: "John" })).toBe(true);
  expect(check({ name: "John", age: undefined })).toBe(false);
  expect(check({ age: 30 })).toBe(false);
});

it("should validate discriminated unions", () => {
  type Dog = { type: "dog"; name: string };
  type Cat = { type: "cat"; age: number };
  type Pet = Dog | Cat;

  const check = is<Pet>();
  expect(check({ type: "dog", name: "Rex" })).toBe(true);
  expect(check({ type: "cat", age: 5 })).toBe(true);
  expect(check({ type: "dog", age: 5 })).toBe(false);
  expect(check({ type: "cat", name: "Rex" })).toBe(false);
  expect(check({ type: "bird" })).toBe(false);
  expect(check({})).toBe(false);
  expect(check({ type: "dog" })).toBe(false);
});

it("should validate record types", () => {
  const check = is<Record<string, number>>();

  expect(check({ a: 1, b: 2 })).toBe(true);
  expect(check({ a: "1", b: 2 })).toBe(false);
  expect(check({ a: 1, b: "2" })).toBe(false);
  expect(check("123")).toBe(false);
});

it("should validate record types", () => {
  const check = is<Record<string, number>>();

  expect(check({ a: 1, b: 2 })).toBe(true);
  expect(check({ a: "1", b: 2 })).toBe(false);
  expect(check({ a: 1, b: "2" })).toBe(false);
  expect(check("123")).toBe(false);
});
