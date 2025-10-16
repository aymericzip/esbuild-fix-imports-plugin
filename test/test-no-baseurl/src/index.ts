// Import original tests
import { test } from "./subpath/index.js";
import { test as jsTest } from "./file.js";

// Import alias tests
import { aliasedImport } from "./alias/index.js";

// Import folder import tests
import { folderImport } from "./folder-import/index.js";

// Import extensions tests
import { extensionsTest } from "./extensions/index.js";

// Import nested module tests
import { deepNestedExport } from "./nested/level1/index.js";

// Import Windows path tests
import { testWindowsPaths } from "./windows-path-test.js";
import { simulateWindowsPathHandling } from "./windows-simulation-test.js";
import { detectBackslashes } from "./backslash-detector.js";

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

// Run Windows path tests
console.log("\n=== Windows Path Tests ===");
testWindowsPaths();
simulateWindowsPathHandling();
detectBackslashes();

console.log("\n=== All tests completed ===");
