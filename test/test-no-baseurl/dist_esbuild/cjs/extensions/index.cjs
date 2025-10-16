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
var extensions_exports = {};
__export(extensions_exports, {
  extensionsTest: () => extensionsTest
});
module.exports = __toCommonJS(extensions_exports);
var import_component = require('./component.cjs');
var import_data = require('./data.cjs');
var import_styles = require('./styles.cjs');
const extensionsTest = {
  tsxComponent: import_component.tsxComponent,
  jsonData: import_data.jsonData,
  cssStyles: import_styles.cssStyles
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  extensionsTest
});
