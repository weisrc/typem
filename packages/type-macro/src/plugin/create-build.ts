import { createTsProgram } from "./create-ts-program";
import { transform } from "./transform";
import { readFile } from "fs/promises";

export function createBuild(onAddModule: (name: string, code: string) => void) {
  const program = createTsProgram();
  const modules: Record<string, string> = {};

  function addModule(name: string, code: string) {
    modules[name] = code;
    onAddModule(name, code);
  }

  async function load(path: string) {
    return (
      transform(program, addModule, path) ?? (await readFile(path, "utf-8"))
    );
  }

  async function loadVirtual(path: string) {
    if (modules[path]) {
      return modules[path];
    }
    throw new Error(`Virtual module ${path} not found`);
  }

  function isVirtual(path: string) {
    return path in modules;
  }

  return {
    load,
    loadVirtual,
    isVirtual,
  };
}
