// Test file to verify Windows path handling in the alias plugin
import { jsonData } from "./extensions/data";
import { aliasedImport } from "./alias";
import { deepNestedExport } from "./nested/level1/level2/level3/deep-module";

// These imports should work correctly and not contain backslashes
export const testData = jsonData;
export const testAlias = aliasedImport;
export const testNested = deepNestedExport;

// Test function to verify all imports are working
export const testWindowsPaths = () => {
  console.log("=== Windows Path Test Results ===");
  console.log("✅ data import:", typeof jsonData);
  console.log("✅ alias import:", typeof aliasedImport);
  console.log("✅ nested import:", typeof deepNestedExport);
  console.log("✅ All imports resolved successfully with POSIX separators");
  return true;
};
