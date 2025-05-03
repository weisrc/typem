import { $ } from "bun";

async function buildTypem() {
  console.log("Building typem");
  await $`cd packages/typem; bun run build`;
}

async function runTests() {
  const packages = [
    "packages/json-schema",
    "packages/predicate",
    "packages/fetch-handler",
  ];

  for (const pkg of packages) {
    console.log(`Testing ${pkg}`);
    await $`cd ${pkg}; rm -rf coverage; bun test --coverage --coverage-reporter lcov`;
  }
}

await buildTypem();
await runTests();
