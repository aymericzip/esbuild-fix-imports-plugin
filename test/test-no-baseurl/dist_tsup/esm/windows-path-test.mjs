import { jsonData } from "./extensions/data.mjs";
import { aliasedImport } from "./alias/index.mjs";
import { deepNestedExport } from "./nested/level1/level2/level3/deep-module.mjs";
const testData = jsonData;
const testAlias = aliasedImport;
const testNested = deepNestedExport;
const testWindowsPaths = () => {
  console.log("=== Windows Path Test Results ===");
  console.log("\u2705 data import:", typeof jsonData);
  console.log("\u2705 alias import:", typeof aliasedImport);
  console.log("\u2705 nested import:", typeof deepNestedExport);
  console.log("\u2705 All imports resolved successfully with POSIX separators");
  return true;
};
export {
  testAlias,
  testData,
  testNested,
  testWindowsPaths
};
//# sourceMappingURL=windows-path-test.mjs.map