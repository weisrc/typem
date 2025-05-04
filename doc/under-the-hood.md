---
title: Under the Hood
description: How the library works internally
---

# Under the Hood

The `typem` package defines a transformer plugin that replaces all calls of functions with the tag property `__macro` with another function imported from a generated virtual module.

Here is a concrete example with the following source code:
```ts
%include "@examples/under-the-hood/source.ts"%
```

It will be transformed into the following code:
```ts
%include "@examples/under-the-hood/transformed.ts"%
```

It will also generate the `virtual-module` that contains the implementation of the function:
```ts
%include "@examples/under-the-hood/virtual-module.ts"%
```

In this case, the virual module imports `@typem/predicate/env` because the type of `__macro` is the string `@typem/predicate/env`. Furtheremore, the name of the actual name of the virtual module is `virtual:typem-zABCDEFGHIJKLMNO`.

## Code Generation

The code generation is only based on the type information. So, it is not possible to use the transformer to generate arbitrary code at compile time. However, this makes implementing macros for types straightforward as one only needs to make sure to implement all required functions instead of tackling with the underlying TypeScript compiler datatypes.

> [!TIP]
> The generated and transformed code will be logged in the terminal by setting the `TYPEM_DEBUG` environment variable to `true`.