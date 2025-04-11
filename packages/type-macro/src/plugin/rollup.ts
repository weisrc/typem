import type { Plugin } from "rollup";
import { base } from "./base";

export type TypeMacroRollupOptions = {};

export default function typeMacro(options: TypeMacroRollupOptions = {}): Plugin {
  const { load, isVirtual, loadVirtual } = base(() => {});

  return {
    name: "type-macro",

    async resolveId(source) {
      if (isVirtual(source)) {
        return source;
      }
      return null;
    },

    async load(id) {
      if (isVirtual(id)) {
        const contents = await loadVirtual(id);
        return contents;
      }

      const contents = await load(id);
      if (contents) {
        return contents;
      }

      return null;
    },
  };
}
