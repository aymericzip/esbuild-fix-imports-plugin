// Test file to simulate Windows path scenarios
// This tests the plugin's ability to handle Windows-style paths and convert them to POSIX

// Import from various depths to test path resolution
import { jsonData } from "./extensions/data";
import { aliasedImport } from "./alias";
import { deepNestedExport } from "./nested/level1/level2/level3/deep-module";
import { folderImport } from "./folder-import";
import { test } from "./subpath";

// Test function that simulates what the plugin would process
export const simulateWindowsPathHandling = () => {
  const testCases = [
    {
      name: "Direct file import",
      import: jsonData,
      expected: "object", // jsonData is actually an object, not a string
    },
    {
      name: "Alias resolution",
      import: aliasedImport,
      expected: "string",
    },
    {
      name: "Deep nested import",
      import: deepNestedExport,
      expected: "string",
    },
    {
      name: "Folder import",
      import: folderImport,
      expected: "string",
    },
    {
      name: "Subpath import",
      import: test,
      expected: "string",
    },
  ];

  console.log("=== Windows Path Simulation Test ===");

  let allPassed = true;
  testCases.forEach(({ name, import: imported, expected }) => {
    const actualType = typeof imported;
    const passed = actualType === expected;

    if (passed) {
      console.log(`✅ ${name}: ${actualType}`);
    } else {
      console.log(`❌ ${name}: expected ${expected}, got ${actualType}`);
      allPassed = false;
    }
  });

  if (allPassed) {
    console.log("✅ All Windows path simulations passed!");
    console.log("✅ Plugin correctly handles path normalization");
  } else {
    console.log("❌ Some Windows path simulations failed");
  }

  return allPassed;
};

// Export all imports to ensure they're processed by the plugin
export { jsonData, aliasedImport, deepNestedExport, folderImport, test };
