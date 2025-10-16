import { build } from "esbuild";
import fg from "fast-glob";
import { fixImportsPlugin } from "../dist/esm/index.mjs";
import { writeFilePlugin } from "../dist/esm/writeFilePlugin.mjs";

/** @type {import('esbuild').BuildOptions} */
export const common = {
  target: "esnext",
  platform: "node",
  bundle: false, // No bundle
  write: false, // Cannot write files to disk, it should be done in memory for the plugins to access the output files
  tsconfig: "./tsconfig.json",
  plugins: [fixImportsPlugin(), writeFilePlugin()],
  loader: {
    ".md": "copy",
    ".json": "copy",
    ".css": "copy",
  },
};

/** collect entry points like tsup's entry + excludes */
const getEntryPoints = async () => await fg(["src/**/*"], { onlyFiles: true });

export const buildAll = async () => {
  const entryPoints = await getEntryPoints();

  // CJS
  const CJSPromise = build({
    ...common,
    entryPoints,
    format: "cjs",
    outdir: "dist_esbuild/cjs",
    outExtension: { ".js": ".cjs" },
  });

  // ESM
  const ESMPromise = build({
    ...common,
    entryPoints,
    format: "esm",
    outdir: "dist_esbuild/esm",
    outExtension: { ".js": ".mjs" },
  });

  // Execute both builds in parallel for faster execution
  await Promise.all([CJSPromise, ESMPromise]);
};

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
