import { join, dirname } from "path";
import { readFileSync } from "fs";
import { Plugin } from "vitepress";

type PreprocessorOptions = {
  links?: Record<string, string>;
};

export function preprocessor(options: PreprocessorOptions): Plugin {
  return {
    name: "custom-markdown-preprocessor",
    enforce: "pre",
    transform(code, id) {
      if (id.endsWith(".md")) {
        code = code.replace(/%include "(.+)"%/g, (_, path: string) => {
          const absolutePath = path.startsWith("@")
            ? join(process.cwd(), path.slice(1))
            : join(dirname(id), path);

          try {
            return readFileSync(absolutePath, "utf-8");
          } catch (e) {
            console.error(e);
            return e;
          }
        });

        if (options.links) {
          for (const [key, value] of Object.entries(options.links)) {
            const pattern = new RegExp(`\\b(${key})\\b`, "g");
            code = code.replace(pattern, (match, capture) => {
              return match.replace(capture, `[${capture}](${value})`);
            });
          }
        }

        return code;
      }
    },
  };
}
