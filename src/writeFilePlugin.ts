import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { type Plugin } from "esbuild";

export const writeFilePlugin = (): Plugin => ({
  name: "writeFilePlugin",

  setup: (build) => {
    // (optional) helps make output paths predictable/absolute
    // ensure you pass absWorkingDir in your build() calls:
    // absWorkingDir: process.cwd(),

    build.onEnd(async (result) => {
      if (result.errors.length) return;

      const files = result.outputFiles ?? [];
      await Promise.all(
        files.map(async (file) => {
          await mkdir(dirname(file.path), { recursive: true });
          // file.contents is a Uint8Array; write as-is
          await writeFile(file.path, file.contents);
        })
      );
      // done: the same paths esbuild would use are now written to disk
    });
  },
});
