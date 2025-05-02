import type { OpenAPIV3_1 } from "openapi-types";

const METHODS = ["get", "post", "put", "patch", "delete"] as const;
type Method = (typeof METHODS)[number];

export type DocsOptions = {
  title: string;
  version: string;
  description: string;
  docsPath: string;
  schemaPath: string;
  getHtml: (options: DocsOptions) => string;
};

const defaultOptions: DocsOptions = {
  title: "API Documentation",
  version: "1.0.0",
  description: "API Documentation",
  docsPath: "/docs",
  schemaPath: "/openapi.json",
  getHtml,
};

export function openapi<T extends Readonly<Record<string, any>>>(
  routes: T,
  options: Partial<DocsOptions> = {}
) {
  const mergedOptions = { ...defaultOptions, ...options };
  const document: OpenAPIV3_1.Document = {
    info: {
      title: mergedOptions.title,
      version: mergedOptions.version,
    },
    openapi: "3.1.0",
    paths: {},
  };

  for (const path in routes) {
    const endpoint = routes[path];

    document.paths[path] = {};
    const paths = document.paths[path];

    if (typeof endpoint === "function" && endpoint.schema) {
      for (const method of METHODS) {
        paths[method as Method] = endpoint.schema;
      }
    }

    if (typeof endpoint === "object") {
      for (const method in endpoint) {
        const lowerMethod = method.toLowerCase() as Method;
        if (!METHODS.includes(lowerMethod)) {
          continue;
        }

        const subEndpoint = endpoint[method];

        if (typeof subEndpoint === "function" && subEndpoint.schema) {
          paths[lowerMethod] = subEndpoint.schema;
        }
      }
    }
  }

  return {
    [mergedOptions.schemaPath]: {
      GET: () => Response.json(document),
    },
    [mergedOptions.docsPath]: {
      GET: () =>
        new Response(mergedOptions.getHtml(mergedOptions), {
          headers: {
            "content-type": "text/html",
          },
        }),
    },
    ...routes,
  };
}

function getHtml(options: DocsOptions) {
  return `
<!doctype html>
<html>
  <head>
    <title>${options.title}</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <div id="app"></div>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
    <script>
      Scalar.createApiReference('#app', { url: ${JSON.stringify(
        options.schemaPath
      )} })
    </script>
  </body>
</html>`;
}
