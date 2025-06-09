import ts from "typescript";
import { typeCodegen } from ".";
import { getMarker, type TransformContext } from "../context";
import { type TypeMap } from "./common";

export function customCodegen(
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
    `Type "${name}" not found in custom map.`
  )})`;

  return `t.${name} ? t.${name}(${inner}) : ${error}`;
}

export function getAnnotations(context: TransformContext, type: ts.Type) {
  return getMarker(context, type, "__annotation");
}

export function splitAnnotations(context: TransformContext, types: ts.Type[]) {
  const annotations: Record<string, any> = {};
  const rest: ts.Type[] = [];

  for (const type of types) {
    const annotation = getAnnotations(context, type);
    if (annotation) {
      Object.assign(annotations, annotation);
    } else {
      rest.push(type);
    }
  }

  return { annotations, rest };
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

export function annotatedIntersectionCodegen(
  context: TransformContext,
  types: ts.Type[],
  typeMap: TypeMap
) {
  const { annotations, rest } = splitAnnotations(context, types);
  return wrapWithAnnotations(
    annotations,
    intersectionCodegen(context, rest, typeMap)
  );
}

export function wrapWithAnnotations(
  annotations: Record<string, any>,
  inner: string
) {
  let out = inner;
  for (const [key, value] of Object.entries(annotations)) {
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

export function tryParseJSON(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export function getAnnotationsFromJsDoc(
  context: TransformContext,
  prop: ts.Symbol
): Record<string, unknown> {
  const annotationEntries = prop.getJsDocTags(context.checker).map((tag) => {
    const value = tag.text
      ? tryParseJSON(tag.text.map((t) => t.text).join(" "))
      : true;
    const key = tag.name === "default" ? "defaultValue" : tag.name;
    return [key, value] as const;
  });

  return Object.fromEntries(annotationEntries);
}
