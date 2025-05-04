import ts from "typescript";
import { typeCodegen } from ".";
import { type TransformContext } from "../context";
import { LITERAL_FALSE, LITERAL_TRUE, type TypeMap } from "./common";

export function unionCodegen(
  context: TransformContext,
  types: ts.Type[],
  typeMap: TypeMap
) {
  let isOptional = false;
  const filteredTypes: ts.Type[] = [];

  for (const type of types) {
    if (type.flags & ts.TypeFlags.Undefined) {
      isOptional = true;
    } else {
      filteredTypes.push(type);
    }
  }

  const inner = unionCodegenInner(context, filteredTypes, typeMap);
  return isOptional ? `t.optional(${inner})` : inner;
}

function unionCodegenInner(
  context: TransformContext,
  types: ts.Type[],
  typeMap: TypeMap
) {
  let mapped = types.map((t) => typeCodegen(context, t, typeMap));
  if (mapped.includes(LITERAL_TRUE) && mapped.includes(LITERAL_FALSE)) {
    mapped = mapped.filter((e) => e !== LITERAL_TRUE && e !== LITERAL_FALSE);
    mapped.push(`t.general("boolean")`);
  }

  if (mapped.length === 1) {
    return mapped[0];
  }

  const joined = mapped.join(", ");

  const discriminant = getDiscriminants(context, types)[0];

  if (discriminant) {
    const [path, values] = discriminant;
    if (values.length === mapped.length) {
      const pathText = JSON.stringify(path);
      const valuesText = JSON.stringify(values);
      return `t.discriminatedUnion(${pathText}, ${valuesText}, [${joined}])`;
    }
  }

  return `t.union([${joined}])`;
}

function getCommonProperties(types: ts.Type[]): string[] {
  const [first, ...rest] = types;

  const common = new Set<string>(
    first.getProperties().map((prop) => prop.name)
  );

  for (const type of rest) {
    const props = new Set<string>(
      type.getProperties().map((prop) => prop.name)
    );
    for (const prop of common) {
      if (!props.has(prop)) {
        common.delete(prop);
      }
    }
  }

  return Array.from(common);
}

function getDiscriminants(context: TransformContext, types: ts.Type[]) {
  const commonProperties = getCommonProperties(types);

  const output: [string, any[]][] = [];

  for (const prop of commonProperties) {
    const values = getValuesOfProperty(context, types, prop);
    if (values && values.length > 0) {
      output.push([prop, values]);
    }
  }

  return Array.from(output);
}

function getValuesOfProperty(
  context: TransformContext,
  types: ts.Type[],
  prop: string
): any[] | undefined {
  const values: any[] = [];

  for (const type of types) {
    const propSymbol = type.getProperty(prop);

    if (!propSymbol) {
      continue;
    }

    const propType = context.checker.getTypeOfSymbol(propSymbol);

    if (!propType.isLiteral()) {
      return;
    }

    values.push(propType.value);
  }

  return values;
}
