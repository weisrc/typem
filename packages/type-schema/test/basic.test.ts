import { expect, it } from "bun:test";
import { getErrors, is, withErrors } from "../src";

it("should validate numbers", () => {
  const isNumber = withErrors(is<number>());

  expect(isNumber(123)).toBe(true);
  expect(getErrors()).toEqual([]);

  expect(isNumber("123")).toBe(false);
  expect(getErrors()).toEqual([
    {
      target: "number",
      type: "invalid-type",
      path: [],
    },
  ]);

  expect(isNumber(true)).toBe(false);
  expect(getErrors()).toEqual([
    {
      target: "number",
      type: "invalid-type",
      path: [],
    },
  ]);
});

it("should validate strings", () => {
  const isString = is<string>();

  expect(isString("123")).toBe(true);
  expect(isString(123)).toBe(false);
  expect(isString(true)).toBe(false);
});

it("should validate booleans", () => {
  const isBoolean = is<boolean>();

  expect(isBoolean(true)).toBe(true);
  expect(isBoolean(false)).toBe(true);
  expect(isBoolean(123)).toBe(false);
  expect(isBoolean("123")).toBe(false);
});

it("should validate null", () => {
  const isNull = is<null>();

  expect(isNull(null)).toBe(true);
  expect(isNull(undefined)).toBe(false);
  expect(isNull(123)).toBe(false);
  expect(isNull("123")).toBe(false);
});

it("should validate undefined", () => {
  const isUndefined = is<undefined>();

  expect(isUndefined(undefined)).toBe(true);
  expect(isUndefined(null)).toBe(false);
  expect(isUndefined(123)).toBe(false);
  expect(isUndefined("123")).toBe(false);
});

it("should validate number literals", () => {
  const is123 = withErrors(is<123>());

  expect(is123(123)).toBe(true);
  expect(getErrors()).toEqual([]);
  expect(is123(321)).toBe(false);
  expect(getErrors()).toEqual([
    {
      type: "invalid-value",
      target: 123,
      path: [],
    },
  ]);
  expect(is123("123")).toBe(false);
  expect(getErrors()).toEqual([
    {
      type: "invalid-value",
      target: 123,
      path: [],
    },
  ]);
});

it("should validate string literals", () => {
  const isHello = is<"hello">();

  expect(isHello("hello")).toBe(true);
  expect(isHello("world")).toBe(false);
  expect(isHello(123)).toBe(false);
});

it("should validate boolean literals", () => {
  const isTrue = is<true>();

  expect(isTrue(true)).toBe(true);
  expect(isTrue(false)).toBe(false);
  expect(isTrue(123)).toBe(false);
});
