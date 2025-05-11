---
title: Predicate
description: Validate the value using TypeScript types.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}
It supports all JSON Schema related annotations from the `typem` package.

```ts
%include "@examples/predicate/user.ts"%
```

## Validation Errors

It is also possible to get the first error message if validation fails using `withErrors` and `getErrors` methods.

```ts
%include "@examples/predicate/with-errors.ts"%
```

By default, only the first error message is returned short-circuiting the validation. This behavior can be changed using `setFirstErrorOnly(false)` to return all error messages.

## Additional Properties

By default, additional properties are allowed. You can annotate with `AdditionalProperties<false>` to disallow additional properties on the object. It is enabled by default, to make it disabled by default, call `setDefaultAdditionalProperties(false)`. If it is disabled by default, you can enable it by annotating with `AdditionalProperties<true>`.


## Discriminated Unions

If a union is discriminable, it will be validated using the discriminant property for performance.

```ts
%include "@examples/predicate/pet.ts"%
```

## Recursive Types

Recursive types are supported even with cyclic references.

```ts
%include "@examples/predicate/graph.ts"%
```
