---
title: JSON Schema
description: Generate JSON schema from TypeScript types
layout: doc
next: /routes-openapi
---

# {{ $frontmatter.title }}

Generate JSON schema from TypeScript types. It supports all JSON Schema related annotations from the `typem` package.

```ts
%include "@examples/json-schema/user.ts"%
```

## Defining Recursive Types

There is no special syntax for defining recursive types. To create a custom reference id, use the ReferenceId type to specify a custom reference id.

## When to use JSDoc tags

Use JSDoc tags when the information is not associated to the type itself. A good use is for field titles and descriptions especially if the field member can be undefined.

In the following example, the generated JSON schema will be wrong.

```ts
type User = {
    name?: string & Description<"name of the user">;
}
```
It should instead be:
```ts
type User = {
    /** @description name of the user */
    name?: string;
}
```

## What happens to undefined, aka optional?

It is removed as undefined is not a valid JSON value.