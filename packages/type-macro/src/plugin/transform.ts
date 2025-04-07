import ts from "typescript";
import { handleCallExpression } from "./handlers/call-expression";
import type { AddModuleFn, TransformContext } from "./context";

export function transform(
  program: ts.Program,
  addModule: AddModuleFn,
  filePath: string
): string | undefined {
  const sourceFile = program.getSourceFile(filePath);

  if (!sourceFile) {
    return;
  }

  const context: TransformContext = {
    raw: sourceFile.getFullText(),
    checker: program.getTypeChecker(),
    addModule,
  };

  visitNode(context, sourceFile);

  return context.raw;
}

function visitNode(context: TransformContext, node: ts.Node) {
  if (ts.isCallExpression(node)) {
    handleCallExpression(context, node);
  }

  node.forEachChild((child) => visitNode(context, child));
}
