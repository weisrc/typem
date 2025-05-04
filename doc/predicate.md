---
title: Predicate
description: Validate the value using TypeScript types
layout: doc
next: /json-schema
---

# Predicate

Validate values using TypeScript types. It is also possible to get the first error message if validation fails using `withErrors` and `getErrors` methods.

```ts
%include "@examples/predicate/simple.ts"%
```

It supports all JSON Schema related annotations from the `typem` package.

## Discriminated Unions

If a union is discriminable, it will be validated using the discriminant property for speed.

```ts
%include "@examples/predicate/pet.ts"%
```

## Recursive Types

Recursive types are supported.

```ts
%include "@examples/predicate/graph.ts"%
```
