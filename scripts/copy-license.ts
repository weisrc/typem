import { Glob } from "bun";
import { dirname, join } from "path";

const glob = new Glob("packages/*/package.json");

const files = glob.scan();

const license = Bun.file("LICENSE");

for await (const file of files) {
  const target = Bun.file(join(dirname(file), "LICENSE"));
  await Bun.write(target, license);
}
