---
description: Automates component, composable, and CMS block scaffolding using the PlentyONE Shop CLI. Use this when creating new code structures instead of manually copying existing files.
tags: [code-generation, scaffolding, component, composable, vue, typescript]
triggers: [generate, create, scaffold, new component, new composable]
---

# Code Generation Skill

## Required Input

When the user requests code generation, determine:

1. **Type**: component or composable?
   - If unclear, ask: "Should I generate [Name] as a component or composable?"
   - Infer from context when possible (e.g., "use\*" prefix = composable)

2. **Name**: What should it be called?
   - Auto-correct naming conventions gracefully:
     - `productcard` → `ProductCard` (components)
     - `cart` → `useCart` (composables)
     - `Product_Card` → `ProductCard`
   - If unsure about correction, ask for confirmation

3. **Optional**: Custom location?
   - Standard locations: `components/` for components, `composables/` for composables
   - Use `--output-path` to specify a custom output path

## Naming Conventions

**Components:** PascalCase (e.g., `ProductCard`, `ShoppingCart`)
**Composables:** camelCase with `use` prefix (e.g., `useCart`, `useWishlist`)

Validation is handled by shop-cli - invalid names will be rejected with clear error messages.

## Commands

```bash
# Standard generation
npm run generate:component ComponentName [--options]
npm run generate:composable useFeatureName [--options]

# Shortcuts for common patterns
npm run generate:block BlockName [--options]         # component with --with-form
npm run generate:settings SettingsName [--options]   # component with --with-view --with-toolbar
```

**Passing options:** Use `--` separator: `npm run generate:component -- Name --skip-tests`

## Available Options

| Option               | Description                            | Example                           |
| -------------------- | -------------------------------------- | --------------------------------- |
| `--output-path=path` | Custom output location                 | `--output-path=components/blocks` |
| `--skip-tests`       | Don't generate test files              | `--skip-tests`                    |
| `--skip-types`       | Don't generate types.ts                | `--skip-types`                    |
| `--with-form`        | Add \*Form.vue (for CMS editor blocks) | `--with-form`                     |
| `--with-view`        | Add View.vue (for settings panels)     | `--with-view`                     |
| `--with-toolbar`     | Add ToolbarTrigger.vue (for settings)  | `--with-toolbar`                  |

## Examples

```bash
# Standard component
npm run generate:component ProductCard

# Composable
npm run generate:composable useShoppingCart

# Block for CMS editor (includes --with-form automatically)
npm run generate:block ImageCarousel

# Settings component (includes --with-view --with-toolbar automatically)
npm run generate:settings ShippingOptions

# Custom path without tests
npm run generate:component MyWidget --output-path=components/custom --skip-tests
```

## Output Format

**Success:**

```json
{
  "success": true,
  "generator": "component",
  "name": "ProductCard",
  "files": ["apps/web/app/components/ProductCard/ProductCard.vue", "..."]
}
```

**Error:**

```json
{
  "success": false,
  "error": "Generator failed"
}
```

## Generated Structure

**Component:**

```
ComponentName/
├── ComponentName.vue
├── types.ts
└── __tests__/ComponentName.spec.ts
```

**Composable:**

```
useFeatureName/
├── useFeatureName.ts
├── types.ts
├── index.ts
└── __tests__/useFeatureName.spec.ts
```
