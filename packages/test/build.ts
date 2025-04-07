import { bunPlugin } from "type-macro/plugin";

Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  format: "esm",
  plugins: [bunPlugin],
});
