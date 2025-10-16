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
var backslash_detector_exports = {};
__export(backslash_detector_exports, {
  aliasedImport: () => import_alias.aliasedImport,
  deepNestedExport: () => import_deep_module.deepNestedExport,
  detectBackslashes: () => detectBackslashes,
  folderImport: () => import_folder_import.folderImport,
  jsonData: () => import_data.jsonData,
  test: () => import_subpath.test
});
module.exports = __toCommonJS(backslash_detector_exports);
var import_data = require('./extensions/data.cjs');
var import_alias = require('./alias/index.cjs');
var import_deep_module = require('./nested/level1/level2/level3/deep-module.cjs');
var import_folder_import = require('./folder-import/index.cjs');
var import_subpath = require('./subpath/index.cjs');
const detectBackslashes = () => {
  console.log("=== Backslash Detection Test ===");
  const imports = [
    { name: "jsonData", value: import_data.jsonData },
    { name: "aliasedImport", value: import_alias.aliasedImport },
    { name: "deepNestedExport", value: import_deep_module.deepNestedExport },
    { name: "folderImport", value: import_folder_import.folderImport },
    { name: "test", value: import_subpath.test }
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  aliasedImport,
  deepNestedExport,
  detectBackslashes,
  folderImport,
  jsonData,
  test
});
