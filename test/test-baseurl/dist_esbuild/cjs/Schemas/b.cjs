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
var b_exports = {};
__export(b_exports, {
  baz: () => baz,
  qux: () => qux
});
module.exports = __toCommonJS(b_exports);
const baz = "This is baz from Schemas/b";
const qux = "This is qux from Schemas/b";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  baz,
  qux
});
//# sourceMappingURL=b.cjs.map
