import { transform } from "../transform";
import { readFile } from "fs/promises";
import ts from "typescript";
import { CUSTOM_MAP, RESERVED_NAMES } from "../constants";

export type TypeMacroOptions = {
  customMap?: Record<string, string>;
  reservedNames?: string[];
};

export function base(
  options: TypeMacroOptions,
  onAddModule: (name: string, code: string) => void
) {
  const program = createTsProgram();
  const modules: Record<string, string> = {};

  function addModule(name: string, code: string) {
    modules[name] = code;
    onAddModule(name, code);
  }

  async function load(path: string) {
    return (
      transform(
        program,
        addModule,
        path,
        options.customMap ?? CUSTOM_MAP,
        options.reservedNames ?? RESERVED_NAMES
      ) ?? (await readFile(path, "utf-8"))
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

function createTsProgram() {
  const configPath = ts.findConfigFile(
    "./",
    ts.sys.fileExists,
    "tsconfig.json"
  );
  const config = configPath
    ? ts.getParsedCommandLineOfConfigFile(
        configPath,
        {},
        {
          ...ts.sys,
          onUnRecoverableConfigFileDiagnostic: console.error,
        }
      )
    : null;

  if (config) {
    return ts.createProgram(config.fileNames, config.options);
  }

  console.warn("tsconfig.json not found, using default TypeScript options.");
  const defaultOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.CommonJS,
  };
  return ts.createProgram([], defaultOptions);
}
