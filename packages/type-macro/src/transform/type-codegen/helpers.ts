import ts from "typescript";
import { typeCodegen } from ".";
import { getMarker, type TransformContext } from "../context";
import { type TypeMap } from "./common";

export function builtinCodegen(
  context: TransformContext,
  name: string,
  type: ts.Type,
  typeMap: TypeMap
) {
  const inner = context.checker
    .getTypeArguments(type as ts.TypeReference)
    .map((t) => typeCodegen(context, t, typeMap))
    .join(", ");

  const error = `t.error(${JSON.stringify(
    `Type "${name}" not found in builtins.`
  )})`;

  return `t.${name} ? t.${name}(${inner}) : ${error}`;
}

export function getTag(context: TransformContext, type: ts.Type) {
  return getMarker(context, type, "__tag");
}

export function splitTags(context: TransformContext, types: ts.Type[]) {
  const tags: Record<string, any> = {};
  const rest: ts.Type[] = [];

  for (const type of types) {
    const tag = getTag(context, type);
    if (tag) {
      Object.assign(tags, tag);
    } else {
      rest.push(type);
    }
  }

  return { tags, rest };
}

export function signaturesCodegen(
  context: TransformContext,
  signatures: readonly ts.Signature[],
  typeMap: TypeMap
) {
  const out = signatures
    .map((sig) => {
      const parameters = sig.parameters.map((param) => {
        const paramType = context.checker.getTypeOfSymbol(param);
        return typeCodegen(context, paramType, typeMap);
      });
      const returnType = typeCodegen(context, sig.getReturnType(), typeMap);
      return `[[${parameters.join(", ")}], ${returnType}]`;
    })
    .join(", ");

  return `[${out}]`;
}

export function intersectionCodegenWithTags(
  context: TransformContext,
  types: ts.Type[],
  typeMap: TypeMap
) {
  const { tags, rest } = splitTags(context, types);
  let out = intersectionCodegen(context, rest, typeMap);

  for (const [key, value] of Object.entries(tags)) {
    out = `(t.${key} ?? (x => x))(${out}, ${JSON.stringify(value)})`;
  }

  return out;
}

export function intersectionCodegen(
  context: TransformContext,
  types: ts.Type[],
  typeMap: TypeMap
) {
  const inner = types.map((t) => typeCodegen(context, t, typeMap));
  if (inner.length === 1) {
    return inner[0];
  }
  return `t.intersection([${inner}])`;
}
