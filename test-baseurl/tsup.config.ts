import { type Options, defineConfig } from "tsup";
import { fixImportsPlugin } from "../src";

export const commonOptions: Options = {
  entry: ["src/**/*"],
  target: "esnext",
  dts: false,
  external: ["fs", "path"],
  clean: true,
  sourcemap: true,
  bundle: false,
  tsconfig: "./tsconfig.json",
  esbuildPlugins: [fixImportsPlugin()],
};

export const option: Options[] = [
  {
    ...commonOptions,
    format: ["cjs"],
    outDir: "dist/cjs",
    outExtension: () => ({
      js: ".cjs",
    }),
  },
  {
    ...commonOptions,
    format: ["esm"],
    outDir: "dist/esm",
    outExtension: () => ({
      js: ".mjs",
    }),
  },
];

export default defineConfig(option);
