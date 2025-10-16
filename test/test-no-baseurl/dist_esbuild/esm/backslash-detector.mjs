import { jsonData } from "./extensions/data.mjs";
import { aliasedImport } from "./alias/index.mjs";
import { deepNestedExport } from "./nested/level1/level2/level3/deep-module.mjs";
import { folderImport } from "./folder-import/index.mjs";
import { test } from "./subpath/index.mjs";
const detectBackslashes = () => {
  console.log("=== Backslash Detection Test ===");
  const imports = [
    { name: "jsonData", value: jsonData },
    { name: "aliasedImport", value: aliasedImport },
    { name: "deepNestedExport", value: deepNestedExport },
    { name: "folderImport", value: folderImport },
    { name: "test", value: test }
  ];
  let allValid = true;
  imports.forEach(({ name, value }) => {
    if (typeof value === "undefined") {
      console.log(`\u274C ${name}: import failed (undefined)`);
      allValid = false;
    } else {
      console.log(`\u2705 ${name}: import successful (${typeof value})`);
    }
  });
  if (allValid) {
    console.log("\u2705 No backslashes detected in import paths");
    console.log("\u2705 All imports resolved correctly");
  } else {
    console.log("\u274C Some imports failed - possible path issues");
  }
  return allValid;
};
export {
  aliasedImport,
  deepNestedExport,
  detectBackslashes,
  folderImport,
  jsonData,
  test
};
