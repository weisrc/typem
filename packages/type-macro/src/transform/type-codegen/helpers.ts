import type ts from "typescript";
import { getMarker, type TransformContext } from "../context";
import {
  LITERAL_FALSE,
  LITERAL_TRUE,
  GENERAL_UNDEFINED,
  type TypeMap,
} from "./common";
import { typeCodegen } from ".";

export function arrayCodegen(
  context: TransformContext,
  type: ts.Type,
  typeMap: TypeMap
) {
  const [innerType] = context.checker.getTypeArguments(
    type as ts.TypeReference
  );
  const inner = typeCodegen(context, innerType, typeMap);
  return `t.array(${inner})`;
}

export function tupleCodegen(
  context: TransformContext,
  type: ts.Type,
  typeMap: TypeMap
) {
  const inner = context.checker
    .getTypeArguments(type as ts.TypeReference)
    .map((t) => typeCodegen(context, t, typeMap))
    .join(", ");
  return `t.tuple(${inner})`;
}

export function splitAnnotations(context: TransformContext, types: ts.Type[]) {
  const annotations: Record<string, any> = {};
  const rest: ts.Type[] = [];

  for (const type of types) {
    const annotation = getMarker(context, type, "__annotation");
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
  let useOptional = false;
  if (mapped.includes(GENERAL_UNDEFINED)) {
    mapped = mapped.filter((e) => e !== GENERAL_UNDEFINED);
    useOptional = true;
  }
  const out = mapped.length > 1 ? `t.union(${mapped.join(", ")})` : mapped[0];
  return useOptional ? `t.optional(${out})` : out;
}

export function objectCodegen(
  context: TransformContext,
  type: ts.Type,
  typeMap: TypeMap
) {
  const properties = type.getProperties().map((prop) => {
    const propType = context.checker.getTypeOfSymbol(prop);
    const inner = typeCodegen(context, propType, typeMap);
    return `${JSON.stringify(prop.name)}: ${inner}`;
  });

  return `t.object({${properties.join(", ")}})`;
}
