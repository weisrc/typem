import ts from "typescript";
import type { TransformContext } from "./context";
import { randomString } from "./name-utils";

type TypeMap = Map<ts.Type, { ref: string; recursive: boolean }>;

export function typeCodegen(
  context: TransformContext,
  type: ts.Type,
  typeMap: TypeMap,
  imports: Set<string>
): string {
  if (typeMap.has(type)) {
    const value = typeMap.get(type)!;
    value.recursive = true;
    return value.ref;
  }

  typeMap.set(type, { ref: randomString(16), recursive: false });

  const code = typeCodegenHelper(context, type, typeMap, imports);

  const value = typeMap.get(type)!;

  typeMap.delete(type);

  if (value.recursive) {
    imports.add("recursive");
    return `recursive((${value.ref}) => ${code})`;
  }

  return code;
}

const basic = [
  "string",
  "number",
  "boolean",
  "bigint",
  "null",
  "undefined",
  "unknown",
  "any",
  "void",
  "object",
];

function typeCodegenHelper(
  context: TransformContext,
  type: ts.Type,
  typeMap: TypeMap,
  imports: Set<string>
) {
  const typeName = context.checker.typeToString(type);

  if (basic.includes(typeName)) {
    imports.add(typeName);
    return `${typeName}`;
  }

  if (typeName == "true") {
    imports.add("literal");
    return `literal(true)`;
  }

  if (typeName == "false") {
    imports.add("literal");
    return `literal(false)`;
  }

  if (type.isLiteral()) {
    imports.add("literal");
    return `literal(${JSON.stringify(type.value)})`;
  }
  if (type.isUnion()) {
    let elements = type.types.map((t) =>
      typeCodegen(context, t, typeMap, imports)
    );

    if (
      elements.includes("literal(true)") &&
      elements.includes("literal(false)")
    ) {
      elements = elements.filter(
        (e) => e !== "literal(true)" && e !== "literal(false)"
      );

      imports.add("boolean");
      elements.push("boolean");
    }

    const inner = elements.join(", ");
    imports.add("union");
    return `union(${inner})`;
  }
  if (type.isIntersection()) {
    const inner = type.types
      .map((t) => typeCodegen(context, t, typeMap, imports))
      .join(", ");
    imports.add("intersection");
    return `intersection(${inner})`;
  }

  if (context.checker.isArrayType(type)) {
    const [innerType] = context.checker.getTypeArguments(
      type as ts.TypeReference
    );
    const inner = typeCodegen(context, innerType, typeMap, imports);
    imports.add("array");
    return `array(${inner})`;
  }
  if (context.checker.isTupleType(type)) {
    const inner = context.checker
      .getTypeArguments(type as ts.TypeReference)
      .map((t) => typeCodegen(context, t, typeMap, imports))
      .join(", ");
    imports.add("tuple");
    return `tuple(${inner})`;
  }

  const properties = type.getProperties().map((prop) => {
    const propType = context.checker.getTypeOfSymbol(prop);
    const inner = typeCodegen(context, propType, typeMap, imports);
    return `${JSON.stringify(prop.name)}: ${inner}`;
  });

  imports.add("object");
  return `object({${properties.join(", ")}})`;
}
