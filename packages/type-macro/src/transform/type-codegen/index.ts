import ts from "typescript";
import { getMarker, type TransformContext } from "../context";
import { randomString } from "../name-utils";
import {
  LITERAL_FALSE,
  LITERAL_TRUE,
  generalTypes,
  specialTypes,
  type TypeMap,
} from "./common";
import {
  arrayCodegen,
  intersectionCodegenWithAnnotations,
  objectCodegen,
  signaturesCodegen,
  tupleCodegen,
  unionCodegen,
} from "./helpers";

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
  const typeName = context.checker.typeToString(type);

  if ((generalTypes as readonly string[]).includes(typeName)) {
    return `t.general(${JSON.stringify(typeName)})`;
  } else if ((specialTypes as readonly string[]).includes(typeName)) {
    return `t.special(${JSON.stringify(typeName)})`;
  } else if (typeName == "true") {
    return LITERAL_TRUE;
  } else if (typeName == "false") {
    return LITERAL_FALSE;
  } else if (type.isLiteral()) {
    return `t.literal(${JSON.stringify(type.value)})`;
  } else if (type.isUnion()) {
    return unionCodegen(context, type.types, typeMap);
  } else if (type.isIntersection()) {
    return intersectionCodegenWithAnnotations(context, type.types, typeMap);
  } else if (context.checker.isArrayType(type)) {
    return arrayCodegen(context, type, typeMap);
  } else if (context.checker.isTupleType(type)) {
    return tupleCodegen(context, type, typeMap);
  }

  const object = objectCodegen(context, type, typeMap);
  const callSignatures = type.getCallSignatures();
  if (callSignatures.length === 0) {
    return object;
  }

  const signatures = signaturesCodegen(context, callSignatures, typeMap);
  return `t.callable(${object}, ${signatures})`;
}
