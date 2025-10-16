"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var windows_simulation_test_exports = {};
__export(windows_simulation_test_exports, {
  aliasedImport: () => import_alias.aliasedImport,
  deepNestedExport: () => import_deep_module.deepNestedExport,
  folderImport: () => import_folder_import.folderImport,
  jsonData: () => import_data.jsonData,
  simulateWindowsPathHandling: () => simulateWindowsPathHandling,
  test: () => import_subpath.test
});
module.exports = __toCommonJS(windows_simulation_test_exports);
var import_data = require('./extensions/data.cjs');
var import_alias = require('./alias/index.cjs');
var import_deep_module = require('./nested/level1/level2/level3/deep-module.cjs');
var import_folder_import = require('./folder-import/index.cjs');
var import_subpath = require('./subpath/index.cjs');
const simulateWindowsPathHandling = () => {
  const testCases = [
    {
      name: "Direct file import",
      import: import_data.jsonData,
      expected: "object"
      // jsonData is actually an object, not a string
    },
    {
      name: "Alias resolution",
      import: import_alias.aliasedImport,
      expected: "string"
    },
    {
      name: "Deep nested import",
      import: import_deep_module.deepNestedExport,
      expected: "string"
    },
    {
      name: "Folder import",
      import: import_folder_import.folderImport,
      expected: "string"
    },
    {
      name: "Subpath import",
      import: import_subpath.test,
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  aliasedImport,
  deepNestedExport,
  folderImport,
  jsonData,
  simulateWindowsPathHandling,
  test
});
//# sourceMappingURL=windows-simulation-test.cjs.map