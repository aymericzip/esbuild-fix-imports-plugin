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
var file_exports = {};
__export(file_exports, {
  testFunction: () => testFunction
});
module.exports = __toCommonJS(file_exports);
var import_a = require('./../../../Schemas/a.cjs');
var import_b = require('./../../../Schemas/b.cjs');
const testFunction = () => {
  console.log("Testing baseUrl imports:", import_a.foo, import_b.baz);
  return { foo: import_a.foo, baz: import_b.baz };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  testFunction
});
//# sourceMappingURL=file.cjs.map