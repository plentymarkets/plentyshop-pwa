# Code Generation Skill

## Description

Automates component, composable, and CMS block scaffolding using the PlentyONE Shop CLI. **Use this skill when creating new code structures** instead of manually copying existing files. Ensures consistent conventions, TypeScript types, test stubs, and proper organization.

**Triggers:** "generate", "create", "scaffold" + "component"/"composable"/"block"/"settings"

## When to Use

✅ **Use:** New components/composables, multi-file features, standardized structures
❌ **Skip:** Editing existing files, one-off utilities, simple snippets

## Quick Commands

```bash
npm run generate:component ComponentName [--options]
npm run generate:composable useFeature [--options]
npm run generate:block ImageBlock [--options]
npm run generate:settings MySettings [--options]
```

**Flags:** `--skip-tests`, `--skip-types`, `--with-form`, `--with-view`, `--with-toolbar`
**Note:** Pass flags with `--` separator: `npm run generate:component -- Name --skip-tests`

## How to Communicate Your Intent

When asking Copilot to generate code, use these patterns for best results:

### ✅ Clear Trigger Phrases

| What You Say                                     | What I Generate    | Why It Works                   |
| ------------------------------------------------ | ------------------ | ------------------------------ |
| "generate a **ProductCard component**"           | Component          | Explicit type keyword          |
| "create a **useWishlist composable**"            | Composable         | Explicit type keyword          |
| "scaffold an **ImageBanner block**"              | Block component    | "block" = component in blocks/ |
| "make a **ShippingSettings settings component**" | Settings component | "settings component" specified |
| "generate **useCart**"                           | Composable         | Naming pattern (use\* prefix)  |
| "create **ProductGallery** in components/blocks" | Block component    | Path context provided          |

### ❌ Ambiguous Requests (I'll ask for clarification)

| What You Say         | Why It's Unclear         | Better Alternative                                     |
| -------------------- | ------------------------ | ------------------------------------------------------ |
| "create ProductCard" | Component or composable? | "create a ProductCard **component**"                   |
| "generate Cart"      | What type?               | "generate a **useCart composable**"                    |
| "scaffold Settings"  | Where does it go?        | "scaffold Settings in **components/settings/general**" |

### 💡 Quick Reference

**Keywords I recognize:**

- "generate", "create", "scaffold", "make"
- "component", "composable", "block", "settings"
- Path hints: "in components/blocks", "in components/settings/\*"
- Naming patterns: `use*` = composable, `*Block` = block component

**Optional flags you can mention:**

- "without tests" → `--skip-tests`
- "without types file" → `--skip-types`
- "with a form" → `--with-form`
- "with view and toolbar" → `--with-view --with-toolbar`

## Interactive Workflow

**Copilot will ask for clarification when:**

1. **Type is ambiguous**
   - Request: "generate ProductCard"
   - Copilot asks: "Should I generate ProductCard as a component or composable?"
   - You answer: "component"

2. **Path needs specification**
   - Request: "create a Settings component"
   - Copilot asks: "Where should I place the Settings component? Options: `components/settings/general`, `components/settings/shipping`, `components/settings/payment`, or specify a custom path."
   - You answer: "components/settings/shipping"

3. **Name doesn't match conventions**
   - Request: "generate product-card component"
   - Copilot asks: "Component names should be PascalCase. Should I use `ProductCard` instead?"
   - You answer: "yes" or provide alternative

4. **Optional features unclear**
   - Request: "create ProductCard component for the editor"
   - Copilot asks: "Should I include a form template for CMS editing? (`--with-form`)"
   - You answer: "yes" or "no"

5. **Conflicts detected**
   - Request: "generate ProductCard component"
   - Copilot detects existing component
   - Copilot asks: "ProductCard already exists at `apps/web/app/components/ProductCard/`. Should I: (a) generate with a different name, (b) skip generation, or (c) proceed anyway?"

**Questions I'll ask (examples):**

```
❓ "Should I generate [Name] as a component or composable?"
❓ "Where should this be placed? (components/, components/blocks/, components/settings/*)"
❓ "Do you want test files? (default: yes, use --skip-tests to skip)"
❓ "Should I include a types.ts file? (default: yes, use --skip-types to skip)"
❓ "Is this a block for the CMS editor? Should I add --with-form?"
❓ "Component name should be PascalCase. Use [SuggestedName]?"
❓ "Composable name should start with 'use'. Use [useSuggestedName]?"
```

**Your responses can be:**

- Simple: "yes", "no", "component", "composable"
- Specific: "components/settings/shipping", "ProductCardGrid"
- With flags: "yes, without tests" → I'll add `--skip-tests`

## Available Generators

### 1. Component Generator

Creates Vue 3 components with full structure:

```bash
# Standard component
./generate.sh component ComponentName

# Block component (CMS content blocks)
./generate.sh component ImageBlock --output-path=components/blocks

# Settings component (admin configuration)
./generate.sh component MySettings --output-path=components/settings/general
```

**Generated structure:**

```
apps/web/app/components/ComponentName/
├── ComponentName.vue              # Main component
├── types.ts                       # TypeScript interfaces
└── __tests__/ComponentName.spec.ts # Test file
```

**Naming:** PascalCase (e.g., `ProductCard`, `AddressForm`, `ImageBlock`)

**Special paths:**

- **Blocks**: Use `--output-path=components/blocks` for CMS content blocks
- **Settings**: Use `--output-path=components/settings/{category}` for admin configuration components

### 2. Composable Generator

Creates Vue 3 composables with composition API pattern:

```bash
./generate.sh composable useFeatureName
```

**Generated structure:**

```
apps/web/app/composables/useFeatureName/
├── useFeatureName.ts              # Main composable
├── types.ts                       # TypeScript interfaces
├── index.ts                       # Clean exports
└── __tests__/useFeatureName.spec.ts # Test file
```

**Naming:** camelCase with `use` prefix (e.g., `useShoppingCart`, `useProductSearch`)

## Non-Interactive Usage

The `generate.sh` script wraps the PlentyONE Shop CLI for non-interactive use:

```bash
# Basic usage
cd .github/skills/code-generation
./generate.sh <generator-type> <name>

# With custom web app path
./generate.sh component ProductCard --web-app-path=src/app

# Examples
./generate.sh component ProductGallery
./generate.sh composable useWishlist
./generate.sh component VideoBlock --output-path=components/blocks
./generate.sh component LanguageSettings --output-path=components/settings/general
```

### Arguments

| Argument         | Description                                                                | Required | Example                           | Validation                                                                  |
| ---------------- | -------------------------------------------------------------------------- | -------- | --------------------------------- | --------------------------------------------------------------------------- |
| `generator-type` | Type of generator (`component`, `composable`)                              | Yes      | `component`                       | Must be `component` or `composable`                                         |
| `name`           | Name in proper case (PascalCase for components, camelCase for composables) | Yes      | `ProductCard`                     | See [Naming Conventions](#naming-conventions)                               |
| `--web-app-path` | Override default web app path                                              | No       | `--web-app-path=src/app`          | Must be valid directory path                                                |
| `--output-path`  | Custom output subdirectory (relative to web app path)                      | No       | `--output-path=components/blocks` | Must start with whitelisted prefix, see [Path Validation](#path-validation) |

### Path Validation

**Allowed prefixes:** `components/`, `composables/`, `pages/`, `layouts/`, `middleware/`, `plugins/`, `utils/`, `server/`

**Security:** ❌ No `..`, ❌ No absolute paths, ❌ Only alphanumeric/dash/underscore/slash, ❌ Must use whitelisted prefix

**Examples:** ✅ `components/blocks`, ✅ `components/settings/general` | ❌ `../../etc`, ❌ `/tmp/bad`, ❌ `node_modules/evil`

### Output Format

Success: `{"success": true, "generator": "component", "name": "ProductCard", "files": [...]}`
Error: `{"success": false, "error": "Component ProductCard already exists"}`

## Naming Conventions

### Components (PascalCase)

Components must start with an uppercase letter and use PascalCase:

- ✅ `ProductCard`, `ShoppingCart`, `AddressForm`, `VideoBlock`
- ❌ `productCard` (lowercase start)
- ❌ `product-card` (kebab-case)
- ❌ `PRODUCTCARD` (all caps)
- ❌ `Product_Card` (underscores)

**Validation:** Must match `^[A-Z][a-zA-Z0-9]*$`

### Composables (camelCase with `use` prefix)

Composables must start with `use` followed by PascalCase:

- ✅ `useShoppingCart`, `useProduct`, `useWishlist`, `useEditor`
- ❌ `UseShoppingCart` (PascalCase)
- ❌ `shopping-cart` (no `use` prefix)
- ❌ `shoppingCart` (no `use` prefix)
- ❌ `useproduct` (lowercase after `use`)

**Validation:** Must match `^use[A-Z][a-zA-Z0-9]*$`

## Error Handling

| Error                                             | Cause                      | Solution                                             |
| ------------------------------------------------- | -------------------------- | ---------------------------------------------------- |
| `File already exists`                             | Name conflict              | Choose different name or remove existing files       |
| `Invalid component name: must be PascalCase`      | Wrong naming convention    | Use PascalCase starting with uppercase letter        |
| `Invalid composable name: must start with 'use'`  | Missing or wrong prefix    | Start with `use` followed by PascalCase              |
| `Invalid name format`                             | Special characters in name | Use only alphanumeric characters                     |
| `Invalid output path: directory traversal`        | Path contains `..`         | Use relative paths without directory traversal       |
| `Invalid output path: absolute paths not allowed` | Path starts with `/`       | Use relative paths only                              |
| `Invalid output path: must start with one of`     | Non-whitelisted prefix     | Use allowed prefixes (components, composables, etc.) |
| `Invalid output path: only alphanumeric...`       | Special characters in path | Use only alphanumeric, dash, underscore, and `/`     |
| `npx: command not found`                          | Node.js not installed      | Ensure Node.js is installed and in PATH              |
| `Generator not found`                             | Invalid generator type     | Use `component` or `composable`                      |

## Example Workflows

**Creating a Standard Component:**

```bash
./generate.sh component ProductCard
# Result: Component in components/ProductCard/ with types and tests
```

**Creating a Block Component (Editor/CMS):**

```bash
./generate.sh component VideoBlock --output-path=components/blocks
# Result: Component in components/blocks/VideoBlock/
# Manual steps: Create VideoBlockForm.vue, add to utils/blocks-imports.ts
```

**Block considerations:** CMS content blocks need `*Form.vue` for editor, use `getEditorTranslation()`, register in `utils/blocks-imports.ts`

**Creating a Settings Component:**

```bash
./generate.sh component LanguageSettings --output-path=components/settings/general
# Result: Component in components/settings/general/LanguageSettings/
# Manual steps: Create View.vue/ToolbarTrigger.vue, register in utils/settings-groups-imports.ts
```

**Settings considerations:** Admin panels organized by category folders, use `View.vue`/`ToolbarTrigger.vue` patterns, nested subcategories supported, use `getEditorTranslation()` for English-only admin interface

**Creating a Composable:**

```bash
./generate.sh composable useShoppingCart
# Result: Composable in composables/useShoppingCart/ with proper exports and tests
```

## Best Practices

1. Always use generators for new components/composables
2. Follow naming conventions strictly (PascalCase/camelCase)
3. Use `--output-path` for blocks and settings
4. Review generated files before committing
5. For blocks: Create `*Form.vue` for editor configuration
6. For settings: Consider `View.vue` or `ToolbarTrigger.vue` patterns
7. Register dynamic components in respective imports files

## Project-Specific Patterns

**Blocks** (`components/blocks/`) - Frontend CMS blocks, auto-discovered via `utils/blocks-imports.ts`, companion `*Form.vue` for editor, use `getEditorTranslation()` for admin

**Settings** (`components/settings/{category}/`) - Admin config, grouped by category, nested structure, `View.vue`/`ToolbarTrigger.vue` patterns, auto-discovered via `utils/settings-groups-imports.ts`, use `getEditorTranslation()`

**Components** (`components/`) - Standard Vue components, frontend shop, regular i18n via auto-imported `t()`, follow Nuxt auto-import

## CI/CD Integration

Script validated via `.github/workflows/integration.yml`:

- Shellcheck linting on every PR
- Validates syntax and security
- Ignores SC2312, SC1091

**Run locally:** `shellcheck -e SC2312 -e SC1091 .github/skills/code-generation/generate.sh`

## Security & Best Practices

✅ Input validation (regex, whitelist, character check)
✅ No command injection (direct npx, no eval)
✅ Path traversal protection (blocks `..`, absolute paths)
✅ Directory whitelist (allowed prefixes only)
✅ Template injection prevention (name validation)
✅ Error cleanup (trap removes partial files)
✅ Least privilege (no sudo, whitelisted paths)
✅ Shellcheck validated

**Performance:** ~1-2 seconds generation, minimal memory, optimized I/O
