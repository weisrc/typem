import { plugin } from "bun";
import typeMacro from "./bun";

plugin(
  typeMacro({
    preload: true,
  })
);
