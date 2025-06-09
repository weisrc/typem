import type ts from "typescript";
import { randomString, uniqueSymbol } from "./name-utils";
import { debug } from "./logging";

export type AddModuleFn = (name: string, code: string) => void;

export type TransformContext = {
  raw: string;
  checker: ts.TypeChecker;
  options: ts.CompilerOptions;
  addModule: AddModuleFn;
  customMap: Record<string, string>;
  reservedNames: readonly string[];
};

export function replaceNodeText(
  context: TransformContext,
  node: ts.Node,
  code: string
) {
  const start = node.getStart();
  const end = node.getEnd();
  context.raw = context.raw.slice(0, start) + code + context.raw.slice(end);
}

export function getMarker(
  context: TransformContext,
  type: ts.Type,
  name: string
) {
  const property = type.getProperty(name);
  const propertyType = property && context.checker.getTypeOfSymbol(property);

  if (!propertyType) return;

  return getLiteral(context, propertyType);
}

export function getLiteral(context: TransformContext, type: ts.Type): any {
  const text = context.checker.typeToString(type);
  if (text === "undefined") return undefined;
  if (text === "null") return null;
  if (text === "true") return true;
  if (text === "false") return false;

  if (type.isLiteral()) {
    return type.value;
  }

  if (context.checker.isTupleType(type)) {
    return context.checker
      .getTypeArguments(type as ts.TypeReference)
      .map((t) => getLiteral(context, t));
  }
  if (type.isUnion()) {
    const unionTypes = type.types.map((t) => getLiteral(context, t));
    return unionTypes.filter((x) => x !== undefined)[0];
  }
  const properties = type.getProperties();
  if (properties.length === 0) return;
  const out: Record<string, any> = {};
  for (const prop of properties) {
    const propType = context.checker.getTypeOfSymbol(prop);
    const value = getLiteral(context, propType);
    if (value !== undefined) {
      out[prop.name] = value;
    }
  }
  return out;
}

export function augmentNode(
  context: TransformContext,
  node: ts.Node,
  codegen: string
) {
  const id = uniqueSymbol(
    node.getText().length,
    node.getSourceFile(),
    context.checker,
    context.reservedNames
  );

  replaceNodeText(context, node, id);

  const moduleId = "virtual:typem-" + randomString(16);
  context.raw += `\nimport ${id} from "${moduleId}";`;

  debug("Trasnformed source", context.raw);
  debug("Augmenting node", node.getText(), "with:\n", codegen);
  context.addModule(moduleId, codegen);
}
