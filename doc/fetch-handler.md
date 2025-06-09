---
title: Fetch Handler
description: Convert functions into HTTP endpoints with validation and serialization.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

```ts
%include "@examples/fetch-handler/hello.ts"%
```

## Defining a custom extractor

```ts
%include "@examples/fetch-handler/custom-extractor.ts"%
```

## Custom Output Handler and Error Handler

- Use `setOutputHandler` to set a custom output handler and `setErrorHandler` to set a custom error handler.
- By default, all instances of `HttpError` will be caught.
