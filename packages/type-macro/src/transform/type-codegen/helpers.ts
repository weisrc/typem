import ts from "typescript";
import { getMarker, type TransformContext } from "../context";
import { LITERAL_FALSE, LITERAL_TRUE, type TypeMap } from "./common";
import { typeCodegen } from ".";
import { MODIFIER_MAP } from "../../constants";

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

export function getAnnotation(context: TransformContext, type: ts.Type) {
  return getMarker(context, type, "__annotation");
}

export function splitAnnotations(context: TransformContext, types: ts.Type[]) {
  const annotations: Record<string, any> = {};
  const rest: ts.Type[] = [];

  for (const type of types) {
    const annotation = getAnnotation(context, type);
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

export function intersectionCodegenWithAnnotations(
  context: TransformContext,
  types: ts.Type[],
  typeMap: TypeMap
) {
  const { annotations, rest } = splitAnnotations(context, types);
  let out = intersectionCodegen(context, rest, typeMap);

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
  return `t.intersection(${inner})`;
}

export function unionCodegen(
  context: TransformContext,
  types: ts.Type[],
  typeMap: TypeMap
) {
  let mapped = types.map((t) => typeCodegen(context, t, typeMap));
  if (mapped.includes(LITERAL_TRUE) && mapped.includes(LITERAL_FALSE)) {
    mapped = mapped.filter((e) => e !== LITERAL_TRUE && e !== LITERAL_FALSE);
    mapped.push(`t.general("boolean")`);
  }
  return mapped.length > 1 ? `t.union(${mapped.join(", ")})` : mapped[0];
}

export function objectCodegen(
  context: TransformContext,
  type: ts.Type,
  typeMap: TypeMap
) {
  const properties = type.getProperties().map((prop) => {
    const propType = context.checker.getTypeOfSymbol(prop);
    let inner = typeCodegen(context, propType, typeMap);
    const modifiers = getPropertyModifiers(prop);

    for (const modifier of modifiers) {
      inner = `(t.${modifier} ?? (x => x))(${inner})`;
    }

    return `${JSON.stringify(prop.name)}: ${inner}`;
  });

  return `t.object({${properties.join(", ")}})`;
}

function getPropertyModifiers(prop: ts.Symbol): string[] {
  const declaration = prop.declarations?.[0];
  if (!declaration || !ts.isPropertySignature(declaration)) {
    return [];
  }
  const modifiers: string[] = [];

  if (declaration.questionToken) {
    modifiers.push("optional");
  }

  for (const modifier of declaration.modifiers || []) {
    const mapped = MODIFIER_MAP[modifier.kind];
    if (mapped) {
      modifiers.push(mapped);
    }
  }

  return modifiers;
}
