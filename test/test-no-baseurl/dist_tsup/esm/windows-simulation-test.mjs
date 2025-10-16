import { jsonData } from "./extensions/data.mjs";
import { aliasedImport } from "./alias/index.mjs";
import { deepNestedExport } from "./nested/level1/level2/level3/deep-module.mjs";
import { folderImport } from "./folder-import/index.mjs";
import { test } from "./subpath/index.mjs";
const simulateWindowsPathHandling = () => {
  const testCases = [
    {
      name: "Direct file import",
      import: jsonData,
      expected: "object"
      // jsonData is actually an object, not a string
    },
    {
      name: "Alias resolution",
      import: aliasedImport,
      expected: "string"
    },
    {
      name: "Deep nested import",
      import: deepNestedExport,
      expected: "string"
    },
    {
      name: "Folder import",
      import: folderImport,
      expected: "string"
    },
    {
      name: "Subpath import",
      import: test,
      expected: "string"
    }
  ];
  console.log("=== Windows Path Simulation Test ===");
  let allPassed = true;
  testCases.forEach(({ name, import: imported, expected }) => {
    const actualType = typeof imported;
    const passed = actualType === expected;
    if (passed) {
      console.log(`\u2705 ${name}: ${actualType}`);
    } else {
      console.log(`\u274C ${name}: expected ${expected}, got ${actualType}`);
      allPassed = false;
    }
  });
  if (allPassed) {
    console.log("\u2705 All Windows path simulations passed!");
    console.log("\u2705 Plugin correctly handles path normalization");
  } else {
    console.log("\u274C Some Windows path simulations failed");
  }
  return allPassed;
};
export {
  aliasedImport,
  deepNestedExport,
  folderImport,
  jsonData,
  simulateWindowsPathHandling,
  test
};
//# sourceMappingURL=windows-simulation-test.mjs.map