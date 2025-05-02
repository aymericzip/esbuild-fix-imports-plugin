// Import original tests
import { test } from "./subpath";
import { test as jsTest } from "./file.js";

// Import alias tests
import { aliasedImport } from "./alias";

// Import folder import tests
import { folderImport } from "./folder-import";

// Import extensions tests
import { extensionsTest } from "./extensions";

// Import nested module tests
import { deepNestedExport } from "./nested/level1";

// Log all test results
console.log("=== Testing esbuild-fix-imports-plugin ===");
console.log("Original tests:");
console.log("- Subpath import:", test);
console.log("- JS file import:", jsTest);
console.log("\nAlias tests:");
console.log("- Aliased import:", aliasedImport);
console.log("\nFolder import tests:");
console.log("- Folder import:", folderImport);
console.log("\nExtensions tests:");
console.log("- TSX component:", extensionsTest.tsxComponent);
console.log("- JSON data:", extensionsTest.jsonData);
console.log("- CSS styles:", extensionsTest.cssStyles);
console.log("\nNested module tests:");
console.log("- Deep nested export:", deepNestedExport);
console.log("\n=== All tests completed ===");
