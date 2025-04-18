import ts from "typescript";

export function uniqueSymbol(
  length: number,
  sourceFile: ts.SourceFile,
  checker: ts.TypeChecker,
  reserved: readonly string[]
) {
  while (true) {
    const name = randomString(length);
    if (isSymbolFree(name, sourceFile, checker) && !reserved.includes(name)) {
      return name;
    }
  }
}

export function randomString(length: number) {
  return Array(length)
    .fill(0)
    .map(() => randomCharacter())
    .join("");
}

export function isSymbolFree(
  name: string,
  sourceFile: ts.SourceFile,
  checker: ts.TypeChecker
): boolean {
  const symbols = checker.getSymbolsInScope(
    sourceFile,
    ts.SymbolFlags.Variable |
      ts.SymbolFlags.Function |
      ts.SymbolFlags.BlockScopedVariable |
      ts.SymbolFlags.Value
  );

  return !symbols.some((symbol) => symbol.getName() === name);
}

let counter = 0;

export function randomCharacter() {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = lower.toUpperCase();
  const chars = lower + upper;
  return chars[counter++ % chars.length];
}
