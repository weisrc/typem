import { expect, it } from "bun:test";
import {
  is,
  type ExclusiveMaximum,
  type ExclusiveMinimum,
  type Format,
  type Maximum,
  type MaxItems,
  type MaxLength,
  type Minimum,
  type MinItems,
  type MinLength,
  type MultipleOf,
  type Pattern,
  type UniqueItems,
} from "../src";
import type { MaxProperties, MinProperties } from "../src/tags";

it("tag pattern", () => {
  const check = is<string & Pattern<"^[a-z]+$">>();

  expect(check("abc")).toBe(true);
  expect(check("abc123")).toBe(false);
});

it("tag format for email", () => {
  const check = is<{
    email: string & Format<"email">;
  }>();

  const cases = [
    ["", false],
    ["hello", false],
    ["hello@world", false],
    ["hello@world.com", true],
  ] as const;

  for (const [email, expected] of cases) {
    expect(check({ email })).toBe(expected);
  }
});

it("tag minimum", () => {
  const check = is<number & Minimum<10>>();

  expect(check(10)).toBe(true);
  expect(check(9)).toBe(false);
});

it("tag maximum", () => {
  const check = is<number & Maximum<10>>();
  expect(check(10)).toBe(true);
  expect(check(11)).toBe(false);
});

it("tag exclusiveMinimum", () => {
  const check = is<number & ExclusiveMinimum<10>>();

  expect(check(10)).toBe(false);
  expect(check(11)).toBe(true);
});

it("tag exclusiveMaximum", () => {
  const check = is<number & ExclusiveMaximum<10>>();

  expect(check(10)).toBe(false);
  expect(check(9)).toBe(true);
});

it("tag multipleOf", () => {
  const check = is<number & MultipleOf<10>>();

  expect(check(10)).toBe(true);
  expect(check(11)).toBe(false);
});

it("tag minItems", () => {
  const check = is<number[] & MinItems<2>>();

  expect(check([1, 2])).toBe(true);
  expect(check([1])).toBe(false);
});

it("tag maxItems", () => {
  const check = is<number[] & MaxItems<2>>();

  expect(check([1, 2])).toBe(true);
  expect(check([1, 2, 3])).toBe(false);
});

it("tag minLength", () => {
  const check = is<string & MinLength<2>>();

  expect(check("12")).toBe(true);
  expect(check("1")).toBe(false);
});

it("tag maxLength", () => {
  const check = is<string & MaxLength<2>>();

  expect(check("12")).toBe(true);
  expect(check("123")).toBe(false);
});

it("tag uniqueItems", () => {
  const check = is<number[] & UniqueItems>();

  expect(check([1, 2, 3])).toBe(true);
  expect(check([1, 2, 2])).toBe(false);
});

it("tag minProperties", () => {
  const check = is<{ a: number; b: number } & MinProperties<2>>();

  expect(check({ a: 1, b: 2 })).toBe(true);
  expect(check({ a: 1 })).toBe(false);
});

it("tag maxProperties", () => {
  const check = is<{ a: number; b: number } & MaxProperties<2>>();

  expect(check({ a: 1, b: 2 })).toBe(true);
  expect(check({ a: 1, b: 2, c: 3 })).toBe(false);
});

it("tag minimum and exclusiveMaximum", () => {
  const check = is<number & Minimum<10> & ExclusiveMaximum<20>>();

  expect(check(9)).toBe(false);
  expect(check(10)).toBe(true);
  expect(check(19)).toBe(true);
  expect(check(20)).toBe(false);
});
