import { expect, it } from "bun:test";
import { is } from "../src";

it("should validate numbers", () => {
  const isNumber = is<number>();

  expect(isNumber(123)).toBe(true);
  expect(isNumber("123")).toBe(false);
  expect(isNumber(true)).toBe(false);
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
  const is123 = is<123>();

  expect(is123(123)).toBe(true);
  expect(is123(321)).toBe(false);
  expect(is123("123")).toBe(false);
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
