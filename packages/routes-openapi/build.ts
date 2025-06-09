Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  format: "esm",
  splitting: true,
  target: "node",
  packages: "external",
});
