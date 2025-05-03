import { defineConfig } from "vitepress";
import { preprocessor } from "./preprocessor";

export default defineConfig({
  title: "Typem",
  description: "Type Macro for TypeScript",
  outDir: "../docs",
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/markdown-examples" },
    ],
    sidebar: [
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
  vite: {
    plugins: [
      preprocessor({
        links: {
          "`predicate`": "predicate",
          "`fetch-handler`": "fetch-handler",
          "`json-schema`": "json-schema",
          "@Routes OpenAPI": "routes-openapi",
        },
      }),
    ],
  },
});
