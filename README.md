# esbuild-fix-imports-plugin

An ESBuild plugin that fixes import paths by applying the following plugins:

- **`fixAliasPlugin`**: Resolves path aliases defined in `tsconfig.json`.
- **`fixFolderImportsPlugin`**: Replaces imports pointing to directories with explicit paths to the `index` file.
- **`fixExtensionsPlugin`**: Appends the correct file extensions to relative import paths.

This plugin ensures correct file extensions, resolves path aliases, and fixes directory imports in your build output when using [`tsup`](https://github.com/egoist/tsup) with `bundle: false`.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Plugins Overview](#plugins-overview)
  - [fixAliasPlugin](#fixaliasplugin)
  - [fixFolderImportsPlugin](#fixfolderimportsplugin)
  - [fixExtensionsPlugin](#fixextensionsplugin)
- [Example Configuration](#example-configuration)
- [Contributing](#contributing)
- [License](#license)

## Installation

Install the package via npm:

```bash
npm install esbuild-fix-imports-plugin
```

Or using pnpm:

```bash
pnpm add esbuild-fix-imports-plugin
```

Or using Yarn:

```bash
yarn add esbuild-fix-imports-plugin
```

## Usage

In your `tsup.config.ts` or ESBuild configuration file, import the plugin and add it to your `esbuildPlugins` array:

```typescript
// tsup.config.ts

import { defineConfig } from "tsup";
import { fixImportsPlugin } from "esbuild-fix-imports-plugin";

export default defineConfig({
  // ... your other configurations
  esbuildPlugins: [fixImportsPlugin()],
});
```

This will apply all three plugins (`fixAliasPlugin`, `fixFolderImportsPlugin`, and `fixExtensionsPlugin`) during the build process.

If you prefer to use the plugins individually, you can import them separately:

```typescript
import {
  fixAliasPlugin,
  fixFolderImportsPlugin,
  fixExtensionsPlugin,
} from "esbuild-fix-imports-plugin";

export default defineConfig({
  // ... your other configurations
  esbuildPlugins: [
    fixAliasPlugin(),
    fixFolderImportsPlugin(),
    fixExtensionsPlugin(),
  ],
});
```

## Plugins Overview

### fixAliasPlugin

**Description**: Resolves path aliases defined in your `tsconfig.json` file and replaces them with relative paths in the output files.

**Use Case**: When using path aliases in TypeScript, the compiled JavaScript files may contain unresolved import paths. This plugin fixes that by converting aliases to relative paths.

**Requirements**:

- Ensure your `tsconfig.json` includes the `paths` configuration.
- Provide the path to `tsconfig.json` in your `tsup` or ESBuild configuration.

**Example `tsconfig.json`**:

```json5
{
  compilerOptions: {
    baseUrl: ".",
    paths: {
      "@utils/*": ["src/utils/*"],
      "@components/*": ["src/components/*"],
    },
    // ... other options
  },
}
```

### fixFolderImportsPlugin

**Description**: Replaces import paths pointing to directories with explicit paths to the `index` file.

**Use Case**: Some module resolvers do not automatically resolve imports to `index` files within directories. This plugin ensures that imports like `import { myFunction } from './utils';` are transformed to `import { myFunction } from './utils/index';`.

### fixExtensionsPlugin

**Description**: Appends the correct file extensions (`.js`, `.mjs`, `.cjs`) to relative import paths in the output files.

**Use Case**: In environments that require explicit file extensions in import statements, this plugin ensures that all relative imports have the correct extensions, preventing runtime errors.

## Example Configuration

Here's a full example of how to configure `tsup` with this plugin:

```typescript
// tsup.config.ts

import { defineConfig } from "tsup";
import { fixImportsPlugin } from "esbuild-fix-imports-plugin";

export default defineConfig([
  {
    entry: ["src/**/*"],
    target: "esnext",
    dts: true,
    external: ["fs", "path"],
    clean: true,
    sourcemap: true,
    bundle: false, // Important: set to false
    tsconfig: "./tsconfig.json",
    format: ["cjs"],
    outDir: "dist/cjs",
    outExtension: () => ({ js: ".cjs" }),
    esbuildPlugins: [fixImportsPlugin()],
  },
  {
    entry: ["src/**/*"],
    target: "esnext",
    dts: true,
    external: ["fs", "path"],
    clean: true,
    sourcemap: true,
    bundle: false, // Important: set to false
    tsconfig: "./tsconfig.json",
    format: ["esm"],
    outDir: "dist/esm",
    outExtension: () => ({ js: ".mjs" }),
    esbuildPlugins: [fixImportsPlugin()],
  },
]);
```

**Explanation**:

- **`bundle: false`**: Setting `bundle` to `false` tells `tsup` not to bundle the modules, which can lead to issues with import paths. This plugin helps resolve those issues.
- **`esbuildPlugins: [fixImportsPlugin()]`**: Applies the combined plugin to fix import paths during the build process.

## Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue on [GitHub](https://github.com/aymericzip/esbuild-fix-imports-plugin/issues).

### Steps to Contribute

1. **Fork the Repository**: Click the "Fork" button at the top-right corner of the repository page.

2. **Clone Your Fork**:

   ```bash
   git clone https://github.com/aymericzip/esbuild-fix-imports-plugin.git
   ```

3. **Create a New Branch**:

   ```bash
   git checkout -b feature/my-new-feature
   ```

4. **Install Dependencies**:

   ```bash
   npm install
   ```

5. **Make Your Changes**: Implement your feature or fix.

6. **Build the Project**:

   ```bash
   npm run build
   ```

7. **Test Your Changes**:

   ```bash
   npm run test
   ```

8. **Commit Your Changes**:

   ```bash
   git commit -am 'Add my new feature'
   ```

9. **Push to Your Fork**:

   ```bash
   git push origin feature/my-new-feature
   ```

10. **Open a Pull Request**: Go to your fork on GitHub and open a pull request to the main repository.

## License

This project is licensed under the ISC License.

## Author

**Aymeric PINEAU**

- **GitHub**: [aymericzip](https://github.com/aymericzip)

---

**Note**: Remember to adjust the plugin configurations according to your project's specific needs and ensure that all paths and options are correctly set.

---

## Acknowledgements

Special thanks to the contributors and the open-source community for their continuous support.

---

## Frequently Asked Questions (FAQ)

### Why do I need this plugin?

When using `tsup` with `bundle: false`, you might encounter issues with import paths in the output files, such as missing file extensions, unresolved path aliases, or imports pointing to directories without explicit `index` files. This plugin automates the process of fixing these issues during the build.

### Can I use this plugin with plain ESBuild?

Yes, you can use the plugins directly with ESBuild by adding them to the `plugins` array in your ESBuild configuration.

```typescript
import esbuild from "esbuild";
import { fixImportsPlugin } from "esbuild-fix-imports-plugin";

esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: false,
  plugins: [fixImportsPlugin()],
  // ... other configurations
});
```

### Do I need all three plugins?

Not necessarily. If you only need to fix specific issues, you can import and apply the individual plugins:

```typescript
import {
  fixAliasPlugin,
  fixExtensionsPlugin,
} from "esbuild-fix-imports-plugin";

export default defineConfig({
  // ... your other configurations
  esbuildPlugins: [fixAliasPlugin(), fixExtensionsPlugin()],
});
```

### What environments benefit from this plugin?

Environments that require explicit file extensions in imports or do not automatically resolve directory imports to `index` files will benefit from this plugin. This includes some Node.js configurations and bundlers.

---

Feel free to open an issue if you have more questions or need assistance.
