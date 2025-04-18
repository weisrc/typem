import ts from "typescript";
import { typeCodegen } from ".";
import { MODIFIER_MAP } from "../../constants";
import { type TransformContext } from "../context";
import { type TypeMap } from "./common";
import { unionCodegen } from "./union";

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
