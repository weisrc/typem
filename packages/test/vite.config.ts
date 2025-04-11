import { dirname, resolve } from 'node:path'
import typeMacro from "type-macro/rollup";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "output",
      formats: ["es"],
      fileName: "output",
    },
  },
  plugins: [typeMacro()],
});
