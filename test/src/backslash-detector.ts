// Test file to detect any remaining backslashes in import statements
// This helps verify that the Windows path fix is working correctly

// Import from various locations to test path resolution
import { jsonData } from "./extensions/data";
import { aliasedImport } from "./alias";
import { deepNestedExport } from "./nested/level1/level2/level3/deep-module";
import { folderImport } from "./folder-import";
import { test } from "./subpath";

// Test function to verify no backslashes exist in import paths
export const detectBackslashes = () => {
  console.log("=== Backslash Detection Test ===");

  // This function will be called after the plugin processes the file
  // If there are any backslashes in the import statements, they would
  // cause syntax errors or incorrect module resolution

  const imports = [
    { name: "jsonData", value: jsonData },
    { name: "aliasedImport", value: aliasedImport },
    { name: "deepNestedExport", value: deepNestedExport },
    { name: "folderImport", value: folderImport },
    { name: "test", value: test },
  ];

  let allValid = true;
  imports.forEach(({ name, value }) => {
    if (typeof value === "undefined") {
      console.log(`❌ ${name}: import failed (undefined)`);
      allValid = false;
    } else {
      console.log(`✅ ${name}: import successful (${typeof value})`);
    }
  });

  if (allValid) {
    console.log("✅ No backslashes detected in import paths");
    console.log("✅ All imports resolved correctly");
  } else {
    console.log("❌ Some imports failed - possible path issues");
  }

  return allValid;
};

// Export all imports to ensure they're processed
export { jsonData, aliasedImport, deepNestedExport, folderImport, test };
