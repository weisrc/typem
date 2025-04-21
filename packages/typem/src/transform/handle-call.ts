import type ts from "typescript";
import { augmentNode, getMarker, type TransformContext } from "./context";
import { typeCodegen } from "./type-codegen";
import { debug } from "./logging";

export function handleCall(context: TransformContext, node: ts.CallExpression) {
  const type = context.checker.getTypeAtLocation(node.expression);
  const macro = getMarker(context, type, "__macro");

  if (typeof macro === "string") {
    return handleMacro(context, node, macro);
  }
}

export function handleMacro(
  context: TransformContext,
  node: ts.CallExpression,
  macroName: string
) {
  const type = context.checker.getTypeAtLocation(node);
  const types = type.aliasTypeArguments!;

  debug(
    "with types:",
    types.map((t) => context.checker.typeToString(t)).join(", ")
  );

  const inner = types.map((t) => typeCodegen(context, t, new Map())).join(", ");
  const code = `import * as t from "${macroName}";\nexport default t.entry(${inner});`;
  augmentNode(context, node.expression, code);
}
