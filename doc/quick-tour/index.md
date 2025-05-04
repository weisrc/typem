---
title: Quick Tour
description: Quick Tour of Typem
---

# Quick Tour

Here is quick examples for using various packages in the Typem project.

## Predicate

Validate values using TypeScript types. It is also possible to get the first error message if validation fails using `withErrors` and `getErrors` methods.

::: details Show the User example
In the below example, `User.id` is a string and it must be a UUID as specified by `Format<"uuid">` annotation.
```ts
%include "@examples/predicate/user.ts"%
```
:::

## Fetch Handler

Using Fetch Handler, you can create HTTP handlers with schema validation and OpenAPI schema generation from functions with type annotations. It relies on Predicate for validation and Typem JSON Schema for JSON schema generation.

::: details Show the Hello example
The `hello` function takes in a `name` parameter extracted from query parameter via `FromQuery<"name">` that has a minimum length of 3 using `MinLength<3>`. It will fail with code 400 if the name parameter is too short.
```ts
%include "@examples/fetch-handler/hello.ts"%
```
:::

## Routes OpenAPI

With Routes OpenAPI, you can create an HTTP server with Bun or anything that has the routes object with an OpenAPI documentation page.

::: details Show the Bun example
Create OpenAPI documentation pages in a few lines of code.


![OpenAPI Documentation Page](openapi-docs-page.png)


The above page is generated automatically by passing the `routes` object through the `openapi` function.
```ts
%include "@examples/routes-openapi/bun.ts"%
```
:::

It is also possible to create custom macros using the `typem` package. See the packages directory in the GitHub repository for examples.
