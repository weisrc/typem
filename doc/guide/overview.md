# What is Typem?

Typem is a library to create functionality based on TypeScript types. Here is a quick example using Predicate.

::: details Show the User example
```ts
%include "@examples/predicate/user.ts"%
```
:::

Using @Fetch Handler, you can create HTTP handlers with schema validation and OpenAPI schema generation from functions with type annotations. It relies on Predicate for validation and Typem JSON Schema for JSON schema generation.

::: details Show the Hello example
```ts
%include "@examples/fetch-handler/hello.ts"%
```
:::

Going a step further, using Routes OpenAPI you can create an HTTP server with Bun or anything that has the routes object with an OpenAPI documentation page:

::: details Show the Bun example
![OpenAPI Documentation Page](openapi-docs-page.png)
```ts
%include "@examples/routes-openapi/bun.ts"%
```
:::


It is also possible to create custom macros using the `typem` package. See the packages directory in the GitHub repository for examples.

## Installation

```bash
npm install -D typem
npm install @typem/predicate
```

### Rollup or Vite

Import `typem/vite` or `typem/rollup` and use the plugin in your configuration file.

### Bun

In your `bunfig.toml` file, add the following:

```toml
preload = ["typem/bun-preload"]
```

::: tip
There is no support for the TypeScript compiler yet. You can use Bun or bundle your code with Rollup or Vite.
:::
