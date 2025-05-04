import { getErrors, predicate, withErrors } from "@typem/predicate";
import type { Minimum } from "typem";

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
console.log(isNode(a)); // true
b.label = 0;
console.log(isNode(a)); // false since 0 violates minimum of 1
console.log(getErrors());
