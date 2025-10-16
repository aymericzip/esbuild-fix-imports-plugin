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
var windows_path_test_exports = {};
__export(windows_path_test_exports, {
  testAlias: () => testAlias,
  testData: () => testData,
  testNested: () => testNested,
  testWindowsPaths: () => testWindowsPaths
});
module.exports = __toCommonJS(windows_path_test_exports);
var import_data = require('./extensions/data.cjs');
var import_alias = require('./alias/index.cjs');
var import_deep_module = require('./nested/level1/level2/level3/deep-module.cjs');
const testData = import_data.jsonData;
const testAlias = import_alias.aliasedImport;
const testNested = import_deep_module.deepNestedExport;
const testWindowsPaths = () => {
  console.log("=== Windows Path Test Results ===");
  console.log("\u2705 data import:", typeof import_data.jsonData);
  console.log("\u2705 alias import:", typeof import_alias.aliasedImport);
  console.log("\u2705 nested import:", typeof import_deep_module.deepNestedExport);
  console.log("\u2705 All imports resolved successfully with POSIX separators");
  return true;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  testAlias,
  testData,
  testNested,
  testWindowsPaths
});
//# sourceMappingURL=windows-path-test.cjs.map