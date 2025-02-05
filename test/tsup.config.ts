import { type Options, defineConfig } from "tsup";
import { option } from "../tsup.config";

export default defineConfig(
  option.map((option) => ({ ...option, minify: true }))
);
