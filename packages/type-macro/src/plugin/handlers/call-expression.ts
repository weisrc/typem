import type ts from "typescript";
import { getMarker, type TransformContext } from "../context";
import { handleMacro } from "./macro";

export function handleCallExpression(
  context: TransformContext,
  node: ts.CallExpression
) {
  const type = context.checker.getTypeAtLocation(node.expression);
  const macro = getMarker(context, type, "__macro");

  if (macro) {
    return handleMacro(context, node, macro);
  }
}
