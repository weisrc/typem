import { $ } from "bun";

const PACKAGES = ["typem", "routes-openapi"];

const MACRO_PACKAGES = ["json-schema", "predicate", "fetch-handler"];

async function build(name: string) {
  console.log(`Building ${name}`);
  await $`cd packages/${name}; bun run build`;
}

async function buildMacro(name: string) {
  console.log(`Building ${name} macro`);
  const prefix = `packages/${name}`;
  const outdir = `${prefix}/dist`;

  await $`rm -rf ${outdir}`;

  await Bun.build({
    entrypoints: [`${prefix}/src`, `${prefix}/src/env`],
    outdir,
    format: "esm",
    splitting: true,
    target: "browser",
    packages: "external",
  });
}

export async function buildAll() {
  for (const name of PACKAGES) {
    await build(name);
  }

  for (const name of MACRO_PACKAGES) {
    await buildMacro(name);
  }
}

buildAll();
