import ts from "typescript";

export function createTsProgram() {
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

  if (!config) {
    throw new Error("Could not parse tsconfig.json");
  }

  const program = ts.createProgram(config.fileNames, config.options);

  return program;
}
