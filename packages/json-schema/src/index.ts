import { macro } from "typem/macro";

export type JsonSchema<_T = any> = () => any;
export type JsonSchemaMacro = <T>() => JsonSchema<T>;
export const jsonSchema = macro<JsonSchemaMacro, "@typem/json-schema/env">();
