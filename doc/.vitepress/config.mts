import { defineConfig } from "vitepress";
import { preprocessor } from "./preprocessor";
import apiSidebar from "../api/typedoc-sidebar.json";

const github = "https://github.com/weisrc/typem";

export default defineConfig({
  title: "Typem",
  description: "Type Macro for TypeScript",
  outDir: "../docs",
  base: "/typem/",
  themeConfig: {
    nav: [{ text: "Overview", link: "/overview" }],
    sidebar: [
      {
        text: "Overview",
        link: "/overview",

        items: [
          { text: "Quick Tour", link: "/quick-tour" },
          { text: "Under the Hood", link: "/under-the-hood" },
        ],
      },
      {
        text: "Predicate",
        link: "/predicate",
        items: [],
      },
      {
        text: "JSON Schema",
        link: "/json-schema",
        items: [],
      },
      {
        text: "Routes OpenAPI",
        link: "/routes-openapi",
        items: [],
      },
      {
        text: "API",
        items: apiSidebar,
      },
    ],
    socialLinks: [{ icon: "github", link: github }],
    search: {
      provider: "local",
    },
  },
  vite: {
    server: {
      allowedHosts: true,
    },
    plugins: [
      preprocessor({
        replace: {
          "https://weisrc.github.io/typem": "",
        },
      }),
    ],
  },
});
