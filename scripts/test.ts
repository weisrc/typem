import { $ } from "bun";
import "./build";

async function runTests() {
  const packages = [
    "packages/json-schema",
    "packages/predicate",
    "packages/fetch-handler",
  ];

  let failed = false;

  for (const pkg of packages) {
    console.log(`Testing ${pkg}`);

    await $`cd ${pkg}; rm -rf coverage; bun test --coverage --coverage-reporter lcov`.catch(
      () => {
        failed = true;
      }
    );
  }

  if (failed) {
    console.error("Some tests failed");
    process.exit(1);
  } else {
    console.log("All tests passed");
  }
}

await runTests();
