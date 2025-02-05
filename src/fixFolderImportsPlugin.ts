import { dirname, resolve } from "path";
import { type Plugin } from "esbuild";

/**
 * ESBuild plugin that replaces import paths pointing to directories
 * with explicit paths to the index file, but only if the output files
 * indicate that a direct file doesn't exist and an index file does.
 *
 * For example, it transforms:
 * ```javascript
 * import { myFunction } from '../folder';
 * ```
 * into:
 * ```javascript
 * import { myFunction } from '../folder/index';
 * ```
 *
 * @returns {import('esbuild').Plugin} An ESBuild plugin object.
 */
export const fixFolderImportsPlugin = (): Plugin => ({
  name: "fixFolderImportsPlugin",
  setup(build) {
    // Determine the output file extension based on the build options.
    const outExtension = build.initialOptions.outExtension?.[".js"] ?? ".js";

    // Hook into the 'onEnd' event of the build process.
    build.onEnd((result) => {
      // If there are build errors, do not proceed.
      if (result.errors.length > 0) {
        return;
      }

      // Collect all .js output file paths in a set for quick existence checks.
      const allJsOutputs = new Set(
        (result.outputFiles ?? [])
          .filter((f) => f.path.endsWith(outExtension))
          .map((f) => f.path)
      );

      // Iterate over each JS output file
      for (const outputFile of result.outputFiles ?? []) {
        if (!outputFile.path.endsWith(outExtension)) {
          continue;
        }

        // Original file contents and the file path
        const fileContents = outputFile.text;
        const filePath = outputFile.path;

        // Modify the file contents by replacing directory imports
        // with explicit index file imports based on the set of output files
        const nextFileContents = modifyFolderImports(
          fileContents,
          filePath,
          outExtension,
          allJsOutputs
        );

        // Update the output file contents only if something changed
        if (nextFileContents !== fileContents) {
          outputFile.contents = Buffer.from(nextFileContents, "utf-8");
        }
      }
    });
  },
});

/**
 * Regex for matching ESM and CJS relative imports.
 */
const ESM_RELATIVE_IMPORT_EXP = /from\s*['"](\..+?)['"]/g;
const CJS_RELATIVE_IMPORT_EXP = /require\(['"](\..+?)['"]\)/g;

/**
 * Regex to detect if an import path already has a file extension.
 */
const hasExtensionRegex = /\.[^./\\]+$/;

/**
 * For each import/require statement in a file, check if it refers to a directory
 * without an explicit index file. If so, and if an `index` file actually exists,
 * transform the path to include `/index`.
 */
const modifyFolderImports = (
  contents: string,
  filePath: string,
  outExtension: string,
  allJsOutputs: Set<string>
): string => {
  // Replace ESM imports
  contents = contents.replace(ESM_RELATIVE_IMPORT_EXP, (match, importPath) => {
    const newPath = replaceFolderImport(
      importPath,
      filePath,
      outExtension,
      allJsOutputs
    );
    return match.replace(importPath, newPath);
  });

  // Replace CJS requires
  contents = contents.replace(CJS_RELATIVE_IMPORT_EXP, (match, importPath) => {
    const newPath = replaceFolderImport(
      importPath,
      filePath,
      outExtension,
      allJsOutputs
    );
    return match.replace(importPath, newPath);
  });

  return contents;
};

/**
 * Decide whether the given import path should have `/index` appended
 * by checking against the set of all generated output paths.
 */
const replaceFolderImport = (
  importPath: string,
  filePath: string,
  outExtension: string,
  allJsOutputs: Set<string>
): string => {
  // If the path already ends with a slash, a dot, or has an extension, skip
  if (
    importPath.endsWith("/") ||
    importPath.endsWith(".") ||
    hasExtensionRegex.test(importPath)
  ) {
    return importPath;
  }

  // Compute the absolute paths for "importPath" and "importPath + /index"
  const currentDir = dirname(filePath);
  const candidateFile = resolve(currentDir, importPath) + outExtension;
  const candidateIndex =
    resolve(currentDir, importPath, "index") + outExtension;

  // If candidateFile is found, do not add /index; otherwise check candidateIndex
  if (allJsOutputs.has(candidateFile)) {
    return importPath;
  } else if (allJsOutputs.has(candidateIndex)) {
    return importPath + "/index";
  }

  return importPath;
};
