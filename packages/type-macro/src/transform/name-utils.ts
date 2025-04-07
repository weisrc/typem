import ts from "typescript";

export function uniqueSymbol(
  length: number,
  sourceFile: ts.SourceFile,
  checker: ts.TypeChecker
) {
  while (true) {
    const name = randomString(length);
    if (isSymbolFree(name, sourceFile, checker)) {
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

export function randomCharacter() {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = lower.toUpperCase();
  const chars = lower + upper;
  return chars[Math.floor(Math.random() * chars.length)];
}
