import { type Plugin } from "esbuild";

/**
 * ESBuild plugin that ensures all relative import paths in the output files
 * have the correct file extensions (.mjs or .cjs), appending them if missing.
 * This is useful for environments that require explicit file extensions in imports.
 *
 * @returns {import('esbuild').Plugin} An ESBuild plugin object.
 */
export const fixExtensionsPlugin = (): Plugin => ({
  name: "fixExtensionsPlugin",
  setup: (build) => {
    // Determine if the output format is ESM (ECMAScript Module).
    const isEsm = build.initialOptions.format === "esm";

    // Determine the output file extension based on the build options.
    const outExtension = build.initialOptions.outExtension?.[".js"] ?? ".js";

    // Hook into the 'onEnd' event of the build process.
    build.onEnd((result) => {
      // If there are build errors, do not proceed.
      if (result.errors.length > 0) {
        return;
      }

      // Iterate over each output file generated by ESBuild.
      for (const outputFile of result.outputFiles ?? []) {
        // Only target files with the specified output extension.
        // This ignores additional files emitted, like sourcemaps (e.g., "*.js.map").
        if (!outputFile.path.endsWith(outExtension)) {
          continue;
        }

        // Get the original file contents.
        const fileContents = outputFile.text;
        // Modify the file contents by appending the correct file extensions.
        const nextFileContents = modifyRelativeImports(
          fileContents,
          isEsm,
          outExtension
        );

        // Update the output file contents with the modified contents.
        outputFile.contents = Buffer.from(nextFileContents);
      }
    });
  },
});

/**
 * Regular expression to match CommonJS require statements with relative paths.
 * Captures the import path and an optional semicolon.
 */
const CJS_RELATIVE_IMPORT_EXP = /require\(["'](\..+)["']\)(;)?/g;

/**
 * Regular expression to match ESM import statements with relative paths.
 * Captures the import path and an optional semicolon.
 */
const ESM_RELATIVE_IMPORT_EXP = /from\s*(["'])(\.[^"']+)\1([^;]*;?)/g;

/**
 * Regular expression to detect if the import path already has an extension,
 * such as .png, .svg, .jpeg, .jpg, etc.
 */
const hasExtensionRegex =
  /\.(?:png|svg|css|scss|csv|tsv|xml|toml|ini|jpe?g|json|md|mdx|json|yaml|gif|webp|ico|mp4|webm|ogg|wav|mp3|m4a|aac|webm|woff2?|eot|ttf|otf|wasm)$/i;

/**
 * Modifies the contents of a file by appending the correct file extensions
 * to relative import paths, depending on the module format.
 *
 * @param {string} contents - The contents of the file to modify.
 * @param {boolean} isEsm - Indicates whether the module format is ESM.
 * @returns {string} The modified file contents.
 */
const modifyRelativeImports = (
  contents: string,
  isEsm: boolean,
  outExtension: string
) =>
  isEsm
    ? modifyEsmImports(contents, outExtension)
    : modifyCjsImports(contents, outExtension);

/**
 * Modifies ESM import statements in the file contents by ensuring that
 * all relative import paths have the correct .mjs extension appended.
 *
 * @param {string} contents - The contents of the file to modify.
 * @returns {string} The modified file contents with updated import paths.
 */
const modifyEsmImports = (contents: string, outExtension: string) => {
  return contents.replace(
    ESM_RELATIVE_IMPORT_EXP,
    (_, quote, importPath, rest = "") => {
      // If the import path ends with '.' or '/', it likely refers to a directory.
      if (importPath.endsWith(".") || importPath.endsWith("/")) {
        // Append '/index.mjs' to the path.
        return `from ${quote}${importPath}/index${outExtension}${quote}${rest}`;
      }

      // If the import path already ends with '.mjs', leave it as is.
      if (importPath.endsWith(outExtension)) {
        return `from ${quote}${importPath}${quote}${rest}`;
      }

      // If the import path has an existing extension (e.g., .png, .svg), leave it as is.
      if (hasExtensionRegex.test(importPath)) {
        return `from ${quote}${importPath}${quote}${rest}`;
      }

      // Otherwise, append '.mjs' to the import path.
      return `from ${quote}${importPath}${outExtension}${quote}${rest}`;
    }
  );
};

/**
 * Modifies CommonJS require statements in the file contents by ensuring that
 * all relative import paths have the correct .cjs extension appended.
 *
 * @param {string} contents - The contents of the file to modify.
 * @returns {string} The modified file contents with updated require paths.
 */
const modifyCjsImports = (contents: string, outExtension: string) => {
  return contents.replace(
    CJS_RELATIVE_IMPORT_EXP,
    (_, importPath, maybeSemicolon = "") => {
      // If the import path ends with '.' or '/', it likely refers to a directory.
      if (importPath.endsWith(".") || importPath.endsWith("/")) {
        // Append '/index.cjs' to the path.
        return `require('${importPath}/index${outExtension}')${maybeSemicolon}`;
      }

      // If the import path already ends with '.cjs', leave it as is.
      if (importPath.endsWith(outExtension)) {
        return `require('${importPath}')${maybeSemicolon}`;
      }

      // If the import path has an existing extension (e.g., .png, .svg), leave it as is.
      if (hasExtensionRegex.test(importPath)) {
        return `require('${importPath}')${maybeSemicolon}`;
      }

      // Otherwise, append '.cjs' to the import path.
      return `require('${importPath}${outExtension}')${maybeSemicolon}`;
    }
  );
};
