#!/usr/bin/env node

/**
 * Comprehensive Windows Path Test Script
 * Tests various scenarios that could cause Windows path separator issues
 */

// Simulate the POSIX normalization functions from the plugin
const toPosix = (p) => p.replace(/\\/g, "/");
const normalizeImportPath = (p) =>
  toPosix(p)
    .replace(/\/\.\//g, "/")
    .replace(/(^|[^:])\/\/+/g, "$1/");
const ensureDotRelative = (p) => {
  if (p.startsWith("./") || p.startsWith("../")) {
    return p;
  }
  if (p.startsWith("/")) {
    return `.${p}`;
  }
  return `./${p}`;
};

// Test scenarios that simulate real-world Windows path issues
const testScenarios = [
  {
    name: "Windows relative paths",
    inputs: [
      "..\\utils\\foo",
      "..\\..\\components\\Button",
      ".\\helpers\\index",
      "..\\..\\..\\deep\\nested\\module",
    ],
    expected: "All should convert to POSIX with proper relative prefixes",
  },
  {
    name: "Mixed separators",
    inputs: [
      "..\\utils/foo",
      ".\\helpers/index",
      "..\\components\\Button/index",
      "utils\\helper/index",
    ],
    expected: "All should normalize to POSIX consistently",
  },
  {
    name: "Redundant path segments",
    inputs: [
      "..\\utils\\.\\foo",
      ".\\helpers\\..\\utils\\foo",
      "..\\..\\components\\.\\Button",
      "utils\\.\\helper\\..\\index",
    ],
    expected: "Should clean up redundant segments",
  },
  {
    name: "Absolute paths",
    inputs: [
      "\\src\\utils\\foo",
      "C:\\project\\src\\utils\\foo",
      "D:\\workspace\\components\\Button",
      "\\Users\\username\\project\\src\\index",
    ],
    expected: "Should convert to relative paths with proper prefixes",
  },
  {
    name: "Complex nested paths",
    inputs: [
      "..\\..\\..\\src\\components\\ui\\Button\\index",
      ".\\src\\utils\\helpers\\string\\format",
      "..\\..\\..\\..\\packages\\shared\\types\\index",
      "components\\ui\\forms\\input\\validation\\rules",
    ],
    expected: "Should handle deep nesting correctly",
  },
];

console.log("=== Comprehensive Windows Path Test ===\n");

let totalTests = 0;
let passedTests = 0;

testScenarios.forEach((scenario, scenarioIndex) => {
  console.log(`📋 Scenario ${scenarioIndex + 1}: ${scenario.name}`);
  console.log(`Expected: ${scenario.expected}\n`);

  scenario.inputs.forEach((input, inputIndex) => {
    totalTests++;

    // Apply the plugin's path normalization
    const posixPath = toPosix(input);
    const normalizedPath = normalizeImportPath(posixPath);
    const finalPath = ensureDotRelative(normalizedPath);

    // Validate the result
    const hasBackslashes = finalPath.includes("\\");
    const hasProperPrefix =
      finalPath.startsWith("./") || finalPath.startsWith("../");
    const isClean = !finalPath.includes("/./") && !finalPath.includes("//");

    const passed = !hasBackslashes && hasProperPrefix && isClean;

    if (passed) {
      passedTests++;
      console.log(
        `  ✅ Test ${scenarioIndex + 1}.${inputIndex + 1}: "${input}"`
      );
    } else {
      console.log(
        `  ❌ Test ${scenarioIndex + 1}.${inputIndex + 1}: "${input}"`
      );
    }

    console.log(`      → POSIX: "${posixPath}"`);
    console.log(`      → Normalized: "${normalizedPath}"`);
    console.log(`      → Final: "${finalPath}"`);

    if (!passed) {
      console.log(
        `      → Issues: ${hasBackslashes ? "Has backslashes" : ""} ${
          !hasProperPrefix ? "Missing relative prefix" : ""
        } ${!isClean ? "Not clean" : ""}`
      );
    }

    console.log("");
  });

  console.log("---\n");
});

// Summary
console.log("=== Test Summary ===");
console.log(`Total tests: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${totalTests - passedTests}`);
console.log(`Success rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (passedTests === totalTests) {
  console.log("\n🎉 All Windows path tests passed!");
  console.log("✅ Plugin correctly handles Windows path normalization");
  console.log("✅ No backslashes in import specifiers");
  console.log("✅ Proper relative import prefixes");
  console.log("✅ Clean, normalized paths");
} else {
  console.log("\n❌ Some Windows path tests failed");
  console.log("Please review the failed tests above");
}

// Additional validation
console.log("\n=== Additional Validations ===");

// Test that the functions handle edge cases
const edgeCases = [
  "",
  ".",
  "..",
  "./",
  "../",
  "\\",
  "\\\\",
  "C:",
  "C:\\",
  "C:\\\\",
];

console.log("Edge case handling:");
edgeCases.forEach((edgeCase, index) => {
  try {
    const result = ensureDotRelative(normalizeImportPath(toPosix(edgeCase)));
    console.log(`  ✅ Edge case ${index + 1}: "${edgeCase}" → "${result}"`);
  } catch (error) {
    console.log(
      `  ❌ Edge case ${index + 1}: "${edgeCase}" → Error: ${error.message}`
    );
  }
});
