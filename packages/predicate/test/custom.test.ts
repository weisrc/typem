import { predicate, withErrors, getErrors } from "@typem/predicate";
import { expect, it } from "bun:test";

it("validate array buffer", () => {
  const check = predicate<{
    data: ArrayBuffer;
  }>();

  expect(check({ data: new ArrayBuffer(10) })).toBe(true);
  expect(check({ data: new ArrayBuffer(0) })).toBe(true);
  expect(check({ data: 123 })).toBe(false);
});

it("validate map", () => {
  const check = predicate<{
    data: Map<string, number>;
  }>();

  expect(
    check({
      data: new Map([
        ["a", 1],
        ["b", 2],
      ]),
    })
  ).toBe(true);
  expect(check({ data: new Map() })).toBe(true);
  expect(check({ data: { a: 1, b: 2 } })).toBe(false);
  expect(check({ data: "not a map" })).toBe(false);
});

it("should validate arrays", () => {
  const check = withErrors(predicate<number[]>());

  expect(check([1, 2, 3])).toBe(true);
  expect(getErrors()).toEqual([]);
  expect(check([1, "2", 3])).toBe(false);
  expect(getErrors()).toEqual([
    {
      type: "invalid-type",
      target: "number",
      path: [1],
    },
  ]);
  expect(check("123")).toBe(false);
});

it("should validate tuples", () => {
  const check = withErrors(predicate<[number, string]>());

  expect(check([1, "2"])).toBe(true);
  expect(getErrors()).toEqual([]);
  expect(check([1, 2])).toBe(false);
  expect(getErrors()).toEqual([
    {
      type: "invalid-type",
      target: "string",
      path: [1],
    },
  ]);
  expect(check([1])).toBe(false);
  expect(check("123")).toBe(false);
});
