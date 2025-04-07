import type ts from "typescript";
import { randomString, uniqueSymbol } from "./name-utils";

export type AddModuleFn = (name: string, code: string) => void;

export type TransformContext = {
  raw: string;
  checker: ts.TypeChecker;
  addModule: AddModuleFn;
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

  if (propertyType.isStringLiteral()) {
    return propertyType.value;
  }
}

export function augmentNode(
  context: TransformContext,
  node: ts.Node,
  codegen: string
) {
  const id = uniqueSymbol(
    node.getText().length,
    node.getSourceFile(),
    context.checker
  );

  replaceNodeText(context, node, id);

  const moduleId = randomString(16);
  context.raw += `\nimport ${id} from "${moduleId}";`;
  context.addModule(moduleId, codegen);
}
