import ts, { couldStartTrivia } from "typescript";
import type { TransformContext } from "../context";
import { augmentNode } from "../context";
import { typeCodegen } from "../type-codegen";

export function handleMacro(
  context: TransformContext,
  node: ts.CallExpression,
  macroName: string
) {
  const type = context.checker.getTypeAtLocation(node);
  const types = type.aliasTypeArguments!;

  const imports = new Set<string>(["entry"]);
  const inner = types.map(t => typeCodegen(context, t, new Map(), imports)).join(", ")
  const head = `import { ${Array.from(imports).join(
    ", "
  )} } from "${macroName}";`;
  augmentNode(
    context,
    node.expression,
    `${head}\nconst x = entry(${inner}); export default x;`
  );

  console.log(context.raw);
}
