import { type BunPlugin, type OnLoadResult } from "bun";
import { createBuild } from "./create-build";

function createBunPlugin(preload: boolean): BunPlugin {
  return {
    name: "type-macro",
    async setup(build) {
      const { load, isVirtual, loadVirtual } = createBuild(
        preload
          ? (name, code) => {
              build.module(name, () => {
                return {
                  contents: code,
                };
              });
            }
          : () => {}
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
        console.log("resolve", args.path);
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

export const preloadBunPlugin = createBunPlugin(true);
export const bunPlugin = createBunPlugin(false);