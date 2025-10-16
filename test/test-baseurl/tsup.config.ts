import { type Options, defineConfig } from "tsup";
import { fixImportsPlugin } from "../../src/index";

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
  loader: {
    ".md": "copy",
    ".json": "copy",
    ".css": "copy",
  },
};

export const options: Options[] = [
  {
    ...commonOptions,
    format: ["cjs"],
    outDir: "dist_tsup/cjs",
    outExtension: () => ({
      js: ".cjs",
    }),
  },
  {
    ...commonOptions,
    format: ["esm"],
    outDir: "dist_tsup/esm",
    outExtension: () => ({
      js: ".mjs",
    }),
  },
];

export default defineConfig(options);
