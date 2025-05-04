import { expect, it } from "bun:test";
import { predicate, setDefaultAdditionalProperties } from "@typem/predicate";
import type {
  AdditionalProperties,
  ExclusiveMaximum,
  ExclusiveMinimum,
  Format,
  Maximum,
  MaxItems,
  MaxLength,
  MaxProperties,
  Minimum,
  MinItems,
  MinLength,
  MinProperties,
  MultipleOf,
  Pattern,
  UniqueItems,
} from "typem";

it("validate annotation pattern", () => {
  const check = predicate<string & Pattern<"alphabet", "^[a-z]+$">>();

  expect(check("abc")).toBe(true);
  expect(check("abc123")).toBe(false);
});

it("validate annotation format for email", () => {
  const check = predicate<{
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

it("validate annotation minimum", () => {
  const check = predicate<number & Minimum<10>>();

  expect(check(10)).toBe(true);
  expect(check(9)).toBe(false);
});

it("validate annotation maximum", () => {
  const check = predicate<number & Maximum<10>>();
  expect(check(10)).toBe(true);
  expect(check(11)).toBe(false);
});

it("validate annotation exclusiveMinimum", () => {
  const check = predicate<number & ExclusiveMinimum<10>>();

  expect(check(10)).toBe(false);
  expect(check(11)).toBe(true);
});

it("validate annotation exclusiveMaximum", () => {
  const check = predicate<number & ExclusiveMaximum<10>>();

  expect(check(10)).toBe(false);
  expect(check(9)).toBe(true);
});

it("validate annotation multipleOf", () => {
  const check = predicate<number & MultipleOf<10>>();

  expect(check(10)).toBe(true);
  expect(check(11)).toBe(false);
});

it("validate annotation minItems", () => {
  const check = predicate<number[] & MinItems<2>>();

  expect(check([1, 2])).toBe(true);
  expect(check([1])).toBe(false);
});

it("validate annotation maxItems", () => {
  const check = predicate<number[] & MaxItems<2>>();

  expect(check([1, 2])).toBe(true);
  expect(check([1, 2, 3])).toBe(false);
});

it("validate annotation minLength", () => {
  const check = predicate<string & MinLength<2>>();

  expect(check("12")).toBe(true);
  expect(check("1")).toBe(false);
});

it("validate annotation maxLength", () => {
  const check = predicate<string & MaxLength<2>>();

  expect(check("12")).toBe(true);
  expect(check("123")).toBe(false);
});

it("validate annotation uniqueItems", () => {
  const check = predicate<number[] & UniqueItems>();

  expect(check([1, 2, 3])).toBe(true);
  expect(check([1, 2, 2])).toBe(false);
});

it("validate annotation minProperties", () => {
  const check = predicate<{ a: number; b: number } & MinProperties<2>>();

  expect(check({ a: 1, b: 2 })).toBe(true);
  expect(check({ a: 1 })).toBe(false);
});

it("validate annotation maxProperties", () => {
  const check = predicate<{ a: number; b: number } & MaxProperties<2>>();

  expect(check({ a: 1, b: 2 })).toBe(true);
  expect(check({ a: 1, b: 2, c: 3 })).toBe(false);
});

it("validate annotation additionalProperties", () => {
  const check1 = predicate<{ a: number }>();
  const check2 = predicate<{ a: number } & AdditionalProperties<false>>();

  expect(check1({ a: 1, b: 2 })).toBe(true);
  expect(check2({ a: 1, b: 2 })).toBe(false);
  expect(check1({ a: 1 })).toBe(true);
  expect(check2({ a: 1 })).toBe(true);
  expect(check1({})).toBe(false);
  expect(check2({})).toBe(false);
});

it("validate annotation additionalProperties with nested objects", () => {
  const check = predicate<
    { a: number; b: { c: number } } & AdditionalProperties<false>
  >();

  expect(check({ a: 1, b: { c: 2 } })).toBe(true);
  expect(check({ a: 1, b: { c: 2, d: 3 } })).toBe(true);
  expect(check({ a: 1, b: { c: 2 }, d: 3 })).toBe(false);

  setDefaultAdditionalProperties(false);
  expect(check({ a: 1, b: { c: 2, d: 3 } })).toBe(false);
  setDefaultAdditionalProperties(true);
});

it("validate annotation minimum and exclusiveMaximum", () => {
  const check = predicate<number & Minimum<10> & ExclusiveMaximum<20>>();

  expect(check(9)).toBe(false);
  expect(check(10)).toBe(true);
  expect(check(19)).toBe(true);
  expect(check(20)).toBe(false);
});
