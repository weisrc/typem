import { it, expect } from "bun:test";

import { getErrors, predicate, withErrors } from "@typem/predicate";
import type { Minimum } from "typem";

it("should validate 1-cycle", () => {
  type Tree = {
    value: number;
    left?: Tree;
    right?: Tree;
  };

  const isTree = withErrors(predicate<Tree>());
  expect(isTree({ value: 1 })).toBe(true);
  expect(isTree({ value: 1, left: { value: 2 } })).toBe(true);
  expect(isTree({ value: 1, left: { value: 2, left: { value: 3 } } })).toBe(
    true
  );
  expect(isTree({ value: 1, left: { value: 2, left: { value: "3" } } })).toBe(
    false
  );
  expect(getErrors()).toEqual([
    {
      type: "invalid-type",
      target: "number",
      path: ["left", "left", "value"],
    },
  ]);
  expect(
    isTree({
      value: 1,
      left: { value: 2, left: { value: 3 } },
      right: { value: 4 },
    })
  ).toBe(true);
  expect(
    isTree({
      value: 1,
      left: { value: 2, left: { value: 3 } },
      right: { value: "4" },
    })
  ).toBe(false);
});

it("should validate 2-cycle", () => {
  type A = {
    value: number;
    next?: B;
  };

  type B = {
    value: string;
    next?: A;
  };

  const isA = predicate<A>();

  expect(isA({ value: 1 })).toBe(true);
  expect(isA({ value: 1, next: { value: "2" } })).toBe(true);
  expect(isA({ value: 1, next: { value: "2", next: { value: 3 } } })).toBe(
    true
  );
  expect(isA({ value: 1, next: { value: "2", next: { value: "nope" } } })).toBe(
    false
  );
  expect(isA({ next: 123 })).toBe(false);
});

it("should not loop in 2-cycle", () => {
  type A = {
    value: number;
    next?: B;
  };

  type B = {
    value: string;
    next?: A;
  };

  const isA = predicate<A>();

  let a: A = { value: 1 };
  let b: B = { value: "2" };
  a.next = b;
  b.next = a;

  expect(isA(a)).toBe(true);
});

it("should fail for bad recursive data", () => {
  type A = {
    value: number;
    next?: B;
  };

  type B = {
    value: string;
    next?: A;
  };

  const isA = withErrors(predicate<A>());

  let a: A = { value: "1" as unknown as number };
  let b: B = { value: "2" };
  a.next = b;
  b.next = a;

  expect(isA(a)).toBe(false);
  expect(getErrors()).toEqual([
    {
      type: "invalid-type",
      target: "number",
      path: ["value"],
    },
  ]);
});

it("works for the graph example", () => {
  type Vertex = {
    label: number & Minimum<1>;
    neighbors: Vertex[];
  };

  const a: Vertex = { label: 1, neighbors: [] };
  const b: Vertex = { label: 2, neighbors: [] };
  const c: Vertex = { label: 3, neighbors: [] };
  a.neighbors.push(b, c);
  b.neighbors.push(a, c);
  c.neighbors.push(a, b);

  const isNode = withErrors(predicate<Vertex>());

  expect(isNode(a)).toBe(true);
  expect(getErrors()).toBeEmpty();

  b.label = 0;
  expect(isNode(a)).toBe(false);
  expect(getErrors()).toEqual([
    {
      path: ["neighbors", 0, "label"],
      target: 1,
      type: "minimum",
    },
  ]);
});
