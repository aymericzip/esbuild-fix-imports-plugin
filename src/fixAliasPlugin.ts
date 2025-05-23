import { dirname, join, parse, relative, resolve } from "path";
import { type Plugin } from "esbuild";
import { loadTsConfig } from "load-tsconfig";
import { existsSync } from "fs";

// Get the current working directory as the origin absolute path.
const originAbsolutePath = process.cwd();

/**
 * ESBuild plugin to forcefully replace path aliases with relative paths in the output files.
 * It reads the alias configuration from tsconfig.json and modifies the output files to resolve the aliases.
 * Also handles baseUrl-based imports when no explicit path aliases are configured.
 *
 * @returns {import('esbuild').Plugin} An ESBuild plugin object.
 */
export const fixAliasPlugin = (): Plugin => ({
  name: "fixAliasPlugin",
  setup: (build) => {
    // Resolve the absolute path to the output directory.
    const outDir = build.initialOptions.outdir ?? "dist";
    const outDirAbsolutePath = resolve(originAbsolutePath, outDir);

    // Determine the output file extension based on the build options.
    const outExtension = build.initialOptions.outExtension?.[".js"] ?? ".js";

    // Import the tsconfig.json
    const tsConfig = loadTsConfig(
      originAbsolutePath,
      build.initialOptions.tsconfig ?? "./tsConfig.ts"
    );

    // Extract the 'paths' from the tsconfig compilerOptions, or default to an empty object.
    const alias = tsConfig?.data.compilerOptions?.paths ?? {};

    // Extract the 'baseUrl' from the tsconfig compilerOptions
    const baseUrl = tsConfig?.data.compilerOptions?.baseUrl;

    // Hook into the 'onEnd' event of the build process.
    build.onEnd((result) => {
      // If there are errors, do not proceed.
      if (result.errors.length > 0) {
        return;
      }

      const entryFiles = (build.initialOptions.entryPoints ?? []) as string[];
      const outputFiles = (result.outputFiles ?? []).filter((outputFile) =>
        outputFile.path.endsWith(outExtension)
      );

      // Iterate over each output file generated by ESBuild.
      for (const outputFile of outputFiles) {
        // Only target files with the specified output extension.
        // This ignores additional files emitted, like sourcemaps (e.g., "*.js.map").

        // If `entry` field is defined in the tsup.config.ts. It will make dismatch between the output file path and the relative path.
        // Result 'folder/index.mjs',
        const relativeOutputPath = relative(
          // '/Users/user/Documents/app/dist/esm/',
          outDirAbsolutePath,
          // '/Users/user/Documents/app/dist/esm/folder/index.mjs',
          outputFile.path
        );

        // 'folder/index',
        const relativeOutputPathWithoutExt =
          getPathWithoutExtension(relativeOutputPath);

        // 'src/folder/index.ts',
        const entryFile =
          entryFiles.find((filePath) =>
            filePath.includes(relativeOutputPathWithoutExt)
          ) ?? "";

        // 'src/folder/index',
        const entryFilePathWithoutExt = getPathWithoutExtension(entryFile);

        // 'src/',
        const ignoredPath = entryFilePathWithoutExt.replace(
          relativeOutputPathWithoutExt,
          ""
        );

        // Calculate the relative path from the output file to the output directory.
        // '../',
        const relativePath = relative(
          // '/Users/user/Documents/app/dist/esm/folder',
          dirname(outputFile.path),
          // '/Users/user/Documents/app/dist/esm/',
          outDirAbsolutePath
        );

        // Get the original file contents.
        const fileContents = outputFile.text;
        // Modify the file contents by replacing aliases with relative paths.
        const nextFileContents = modifyAlias(
          fileContents,
          relativePath,
          alias,
          ignoredPath,
          baseUrl,
          originAbsolutePath
        );

        // Update the output file contents with the modified contents.
        outputFile.contents = Buffer.from(nextFileContents);
      }
    });
  },
});

/**
 * Gets the path without the file extension.
 *
 * @param {string} path - The path to process.
 * @returns {string} The path without the file extension.
 */
export const getPathWithoutExtension = (path: string): string => {
  // Parse the file path
  const parsedPath = parse(path);
  // Reconstruct the path without the extension
  return join(parsedPath.dir, parsedPath.name);
};

// Regular expressions to match ESM import statements and CJS require statements.
const ESM_IMPORT_EXP = /from\s*['"]([^'"]+)['"]/g;
const CJS_REQUIRE_EXP = /require\s*\(\s*['"]([^'"]+?)['"]\s*\)/g;

/**
 * Modifies the contents of a file by replacing path aliases with relative paths.
 *
 * @param {string} contents - The contents of the file to modify.
 * @param {string} relativePath - The relative path from the file to the output directory.
 * @param {Record<string, string[]>} alias - The alias configuration from tsconfig.json.
 * @param {string} ignoredPath - The ignored path from the entry file to the output file
 * @param {string} baseUrl - The baseUrl from the tsconfig compilerOptions
 * @param {string} originAbsolutePath - The origin absolute path
 * @returns {string} The modified file contents.
 */
const modifyAlias = (
  contents: string,
  relativePath: string,
  alias: Record<string, string[]>,
  ignoredPath: string,
  baseUrl: string | undefined,
  originAbsolutePath: string
) => {
  let result = contents;

  // Replace ESM import paths that match aliases with the new relative paths.
  result = result.replace(ESM_IMPORT_EXP, (match, importPath) => {
    const newImportPath = replaceAliasInPath(
      importPath,
      relativePath,
      alias,
      ignoredPath,
      baseUrl,
      originAbsolutePath
    );
    return match.replace(importPath, newImportPath);
  });

  // Replace CJS require paths that match aliases with the new relative paths.
  result = result.replace(CJS_REQUIRE_EXP, (match, importPath) => {
    const newImportPath = replaceAliasInPath(
      importPath,
      relativePath,
      alias,
      ignoredPath,
      baseUrl,
      originAbsolutePath
    );
    return match.replace(importPath, newImportPath);
  });

  return result;
};

/**
 * Cleans up the path by removing redundant './' and '../' segments.
 *
 * @param {string} path - The path to clean up.
 * @returns {string} The cleaned up path.
 */
const cleanPath = (path: string) => path.replace("/./", "/").replace("//", "/");

/**
 * Replaces an import path if it matches any alias with the corresponding relative path.
 *
 * @param {string} importPath - The original import path from the file.
 * @param {string} relativePath - The relative path from the file to the output directory.
 * @param {Record<string, string[]>} alias - The alias configuration from tsconfig.json.
 * @param {string} ignoredPath - The ignored path from the entry file to the output file
 * @param {string} baseUrl - The baseUrl from the tsconfig compilerOptions
 * @param {string} originAbsolutePath - The origin absolute path
 * @returns {string} The new import path with aliases replaced by relative paths.
 */
const replaceAliasInPath = (
  importPath: string,
  relativePath: string,
  alias: Record<string, string[]>,
  ignoredPath: string,
  baseUrl: string | undefined,
  originAbsolutePath: string
) => {
  // Iterate over each alias key in the alias configuration.
  for (const aliasKey in alias) {
    const aliasPatterns = alias[aliasKey]; // Array of alias paths

    // Iterate over each pattern associated with the alias key.
    for (const aliasPattern of aliasPatterns) {
      const fixedAliasPattern = aliasPattern.replace(ignoredPath, "");

      if (aliasKey.endsWith("*")) {
        // Handle wildcard aliases.
        const aliasKeyBase = aliasKey.slice(0, -1);
        const aliasPatternBase = fixedAliasPattern.slice(0, -1);

        // Check if the import path starts with the alias base.
        if (importPath.startsWith(aliasKeyBase)) {
          const restOfPath = importPath.slice(aliasKeyBase.length);

          // Construct the new relative path.
          const newRelativePath = `./${relativePath}/${aliasPatternBase}${restOfPath}`;

          // Clean up the new relative path.
          let cleanedNewRelativePath = cleanPath(newRelativePath);

          return cleanedNewRelativePath;
        }
      } else if (importPath === aliasKey) {
        // Construct the new relative path.
        const newRelativePath = `./${relativePath}/${fixedAliasPattern}`;

        // Clean up the new relative path.
        let cleanedNewRelativePath = cleanPath(newRelativePath);

        return cleanedNewRelativePath;
      }
    }
  }

  // If no explicit alias matches and baseUrl is configured, try to handle baseUrl-based imports
  if (
    baseUrl &&
    !isRelativeImport(importPath) &&
    !isNodeModuleImport(importPath)
  ) {
    // Check if this could be a baseUrl-relative import
    const resolvedBaseUrl = resolve(originAbsolutePath, baseUrl);

    // Try to find the file with common extensions
    const possibleExtensions = ["", ".ts", ".tsx", ".js", ".jsx", ".json"];
    let foundPath = null;

    for (const ext of possibleExtensions) {
      const fullPath = resolve(resolvedBaseUrl, importPath + ext);
      if (existsSync(fullPath)) {
        foundPath = fullPath;
        break;
      }

      // Also try with index file
      const indexPath = resolve(resolvedBaseUrl, importPath, "index" + ext);
      if (existsSync(indexPath)) {
        foundPath = indexPath;
        break;
      }
    }

    if (foundPath) {
      // This is a valid baseUrl-based import, convert it to relative
      const relativeToBase = relative(resolvedBaseUrl, foundPath);
      const cleanedRelativeToBase = getPathWithoutExtension(relativeToBase);

      // Construct the new relative path
      const newRelativePath = `./${relativePath}/${cleanedRelativeToBase}`;
      const cleanedNewRelativePath = cleanPath(newRelativePath);

      return cleanedNewRelativePath;
    }
  }

  // Return the original import path if no alias matches.
  return importPath;
};

/**
 * Checks if an import path is a relative import (starts with ./ or ../)
 */
const isRelativeImport = (importPath: string): boolean => {
  return importPath.startsWith("./") || importPath.startsWith("../");
};

/**
 * Checks if an import path is a node module import (not relative and not absolute)
 * This is a simple heuristic - if it doesn't start with ./ or ../ or /,
 * and doesn't contain a file extension, it's likely a node module
 */
const isNodeModuleImport = (importPath: string): boolean => {
  // If it starts with a dot or slash, it's not a node module
  if (importPath.startsWith(".") || importPath.startsWith("/")) {
    return false;
  }

  // If it contains no slashes, it's likely a node module (e.g., 'react', 'lodash')
  if (!importPath.includes("/")) {
    return true;
  }

  // If it starts with @, it's likely a scoped package (e.g., '@types/node')
  if (importPath.startsWith("@")) {
    return true;
  }

  // Otherwise, we assume it could be a baseUrl-based import
  return false;
};
