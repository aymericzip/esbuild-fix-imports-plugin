import { type Plugin } from "esbuild";
import { fixAliasPlugin } from "./fixAliasPlugin";
import { fixExtensionsPlugin } from "./fixExtensionsPlugin";
import { fixFolderImportsPlugin } from "./fixFolderImportsPlugin";

/**
 * Combined plugin that runs fixAliasPlugin, fixFolderImportsPlugin, and fixExtensionsPlugin.
 *
 * @returns {Plugin} An ESBuild plugin.
 */
export const fixImportsPlugin = (): Plugin => ({
  name: "fixImportsPlugin",
  setup: (build) => {
    // Apply each plugin's setup function
    fixAliasPlugin().setup(build);
    fixFolderImportsPlugin().setup(build);
    fixExtensionsPlugin().setup(build);
  },
});

// Optionally export individual plugins
export { fixAliasPlugin, fixExtensionsPlugin, fixFolderImportsPlugin };
