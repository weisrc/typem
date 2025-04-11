import typeMacro from "type-macro/bun";

Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  format: "esm",
  plugins: [typeMacro()],
});
