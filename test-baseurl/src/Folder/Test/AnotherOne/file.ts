// This demonstrates the issue: these absolute imports work in TypeScript
// thanks to baseUrl, but break after build because they're not converted to relative paths
import { foo } from "Schemas/a";
import { baz } from "Schemas/b";

export const testFunction = () => {
  console.log("Testing baseUrl imports:", foo, baz);
  return { foo, baz };
};
