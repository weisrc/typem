# Typem

[![npm](https://img.shields.io/npm/v/typem)](https://www.npmjs.com/package/typem)
![GitHub](https://img.shields.io/github/license/weisrc/typem)

The Typem Project is a set of packages to create functionality based on TypeScript types.
It comes with a set of packages to help you create type-safe code with less boilerplate.

- [Typem](https://weisrc.github.io/typem/typem) to create TypeScript macros and common annotations.
- [Predicate](https://weisrc.github.io/typem/predicate) to validate values using TypeScript types.
- [JSON Schema](https://weisrc.github.io/typem/json-schema) to generate JSON schema from TypeScript types.
- [Fetch Handler](https://weisrc.github.io/typem/fetch-handler) to create HTTP handlers with type safety.
- [Routes OpenAPI](https://weisrc.github.io/typem/routes-openapi) to create OpenAPI documentation for your routes.

The following packages are planned for the future:
- `@typem/preset` to create default values for a type.
- `@typem/binary` for Binary serialization and deserialization.
- `@typem/drizzle` for Drizzle ORM support.

## Installation

`typem` should be installed as a dependency. See the individual package documentation for installation instructions.

```bash
npm install typem
```

Then use the provided plugin for your build tool.

### Rollup and Vite
Import `typem/vite` or `typem/rollup` and use the plugin in your configuration file.

### Bun
In your `bunfig.toml` file, add the following:
```toml
preload = ["typem/bun-preload"]
```

> [!IMPORTANT]
> There is no support for the TypeScript compiler yet. You can use Bun or bundle your code with Rollup or Vite.

## License
This project is licensed under the MIT License. If you have any ideas for new packages, please open an issue on the GitHub Repository. Also, contributions are welcome!