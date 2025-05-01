import ts from "typescript";
import { type TransformContext } from "../context";
import { randomString } from "../name-utils";
import {
  LITERAL_FALSE,
  LITERAL_TRUE,
  generalTypes,
  specialTypes,
  type TypeMap,
} from "./common";
import {
  builtinCodegen,
  getAnnotation,
  annotatedIntersectionCodegen,
  signaturesCodegen,
  wrapWithAnnotations,
} from "./helpers";
import { unionCodegen } from "./union";
import { objectCodegen } from "./object";
import { debug } from "../logging";

export function typeCodegen(
  context: TransformContext,
  type: ts.Type,
  typeMap: TypeMap
): string {
  if (typeMap.has(type)) {
    const value = typeMap.get(type)!;
    value.recursive = true;
    return value.ref;
  }

  typeMap.set(type, { ref: randomString(16), recursive: false });
  const inner = innerCodegen(context, type, typeMap);
  const value = typeMap.get(type)!;
  typeMap.delete(type);

  if (value.recursive) {
    return `t.recursive((${value.ref}) => ${inner})`;
  }

  return inner;
}

function innerCodegen(
  context: TransformContext,
  type: ts.Type,
  typeMap: TypeMap
) {
  const annotation = getAnnotation(context, type);

  debug("annotation", annotation);
  if (annotation && "builtin" in annotation) {
    const inner = builtinCodegen(context, annotation.builtin, type, typeMap);
    delete annotation.builtin;
    return wrapWithAnnotations(annotation, inner);
  }

  const typeName = context.checker.typeToString(type);

  if ((generalTypes as readonly string[]).includes(typeName)) {
    return `t.general(${JSON.stringify(typeName)})`;
  } else if ((specialTypes as readonly string[]).includes(typeName)) {
    return `t.special(${JSON.stringify(typeName)})`;
  } else if (typeName == "true") {
    return LITERAL_TRUE;
  } else if (typeName == "false") {
    return LITERAL_FALSE;
  } else if (typeName === "null") {
    return `t.literal(null)`;
  } else if (type.isLiteral()) {
    return `t.literal(${JSON.stringify(type.value)})`;
  } else if (type.isUnion()) {
    return unionCodegen(context, type.types, typeMap);
  } else if (type.isIntersection()) {
    return annotatedIntersectionCodegen(context, type.types, typeMap);
  } else if (context.checker.isTupleType(type)) {
    return builtinCodegen(context, "tuple", type, typeMap);
  }

  const qualifiedName = context.checker.getFullyQualifiedName(type.symbol);
  const bultinName = context.builtins[qualifiedName];
  if (bultinName) {
    return builtinCodegen(context, bultinName, type, typeMap);
  }

  if (annotation) {
    return `t.error("annotation not in intersection")`;
  }

  const indexInfos = context.checker.getIndexInfosOfType(type);

  if (indexInfos.length > 0) {
    if (indexInfos.length !== 1) {
      return `t.error("multiple index signatures")`;
    }
    const keyType = indexInfos[0].keyType;
    const valueType = indexInfos[0].type;
    const key = typeCodegen(context, keyType, typeMap);
    const value = typeCodegen(context, valueType, typeMap);
    return `t.record(${key}, ${value})`;
  }

  const object = objectCodegen(context, type, typeMap);
  const callSignatures = type.getCallSignatures();
  if (callSignatures.length === 0) {
    return object;
  }

  const signatures = signaturesCodegen(context, callSignatures, typeMap);
  return `t.callable(${object}, ${signatures})`;
}
