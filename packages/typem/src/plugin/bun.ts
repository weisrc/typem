import type { BunPlugin } from "bun";
import { base, type TypeMacroOptions } from "./base";

export interface TypeMacroBunOptions extends TypeMacroOptions {
  preload?: boolean;
}

export default function typeMacro(
  options: TypeMacroBunOptions = {}
): BunPlugin {
  return {
    name: "@garejs/macro",
    async setup(build) {
      function onAddModule(name: string, code: string) {
        build.module(name, () => {
          return {
            contents: code,
          };
        });
      }

      const { load, isVirtual, loadVirtual } = base(
        options,
        options.preload ? onAddModule : () => {}
      );

      build.onLoad({ filter: /./ }, async (args) => {
        const contents = await load(args.path);
        return { contents, loader: args.loader };
      });

      build.onLoad(
        { filter: /.*/, namespace: "type-macro-virtual" },
        async (args) => {
          const contents = await loadVirtual(args.path);
          return { contents, loader: args.loader };
        }
      );

      build.onResolve({ filter: /./ }, (args) => {
        return isVirtual(args.path)
          ? {
              path: args.path,
              namespace: "type-macro-virtual",
            }
          : undefined;
      });
    },
  };
}
