import ts from "typescript";
import { handleCall } from "./handle-call";
import type { AddModuleFn, TransformContext } from "./context";

export function transform(
  program: ts.Program,
  addModule: AddModuleFn,
  filePath: string,
  customMap: Record<string, string>,
  reservedNames: readonly string[]
): string | undefined {
  const sourceFile = program.getSourceFile(filePath);

  if (!sourceFile) {
    return;
  }

  const context: TransformContext = {
    raw: sourceFile.getFullText(),
    checker: program.getTypeChecker(),
    options: program.getCompilerOptions(),
    addModule,
    customMap,
    reservedNames,
  };

  visitNode(context, sourceFile);

  return context.raw;
}

function visitNode(context: TransformContext, node: ts.Node) {
  if (ts.isCallExpression(node)) {
    handleCall(context, node);
  }

  node.forEachChild((child) => visitNode(context, child));
}
