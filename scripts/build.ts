import { $ } from "bun";

async function runBuild(name: string) {
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
  runBuild("typem");

  const macroPackages = ["json-schema", "predicate", "fetch-handler"];
  for (const pkg of macroPackages) {
    await buildMacro(pkg);
  }
}

buildAll();
