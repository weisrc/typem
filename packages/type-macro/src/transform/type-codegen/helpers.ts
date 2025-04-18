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
  const requiredProperties: string[] = [];

  const properties = type.getProperties().map((prop) => {
    const propType = context.checker.getTypeOfSymbol(prop);
    const [required, modifiers] = getPropertyModifiers(prop);

    if (required) {
      requiredProperties.push(prop.name);
    }

    let inner = objectPropCodegen(context, propType, typeMap, required);

    for (const modifier of modifiers) {
      inner = `(t.${modifier} ?? (x => x))(${inner})`;
    }

    return `${JSON.stringify(prop.name)}: ${inner}`;
  });

  return `t.object({${properties.join(", ")}}, ${JSON.stringify(
    requiredProperties
  )})`;
}

function getPropertyModifiers(prop: ts.Symbol): [boolean, string[]] {
  const declaration = prop.declarations?.[0];
  if (!declaration || !ts.isPropertySignature(declaration)) {
    return [true, []];
  }

  const modifiers: string[] =
    declaration.modifiers?.map((modifier) => MODIFIER_MAP[modifier.kind]) ?? [];

  return [!declaration.questionToken, modifiers];
}

function hasExplictUndefined(
  context: TransformContext,
  type: ts.Type
): boolean {
  if (!type.isUnion()) {
    return false;
  }

  const declaration = type.symbol?.declarations?.[0];
  if (!declaration || !ts.isUnionTypeNode(declaration)) {
    return false;
  }
  const types = declaration.types.map((t) =>
    context.checker.getTypeAtLocation(t)
  );
  return types.some((t) => t.flags & ts.TypeFlags.Undefined);
}

function objectPropCodegen(
  context: TransformContext,
  type: ts.Type,
  typeMap: TypeMap,
  required: boolean
) {
  if (
    required ||
    !type.isUnion() ||
    !context.options.exactOptionalPropertyTypes ||
    hasExplictUndefined(context, type)
  ) {
    return typeCodegen(context, type, typeMap);
  }

  const filtered = type.types.filter(
    (t) => !(t.flags & ts.TypeFlags.Undefined)
  );

  return unionCodegen(context, filtered, typeMap);
}
