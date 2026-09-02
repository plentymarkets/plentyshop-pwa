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
   - Standard locations: `components/` for components, `composables/` for composables (blocks land under
     `components/blocks/` automatically when `--with-form` is used)
   - There is no per-invocation output-path flag; to point the CLI at a different app root entirely, create a
     `.plentyone/shop-cli.json` config file (see `packages/shop-cli/README.md`)

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

| Option                    | Description                                                                                 | Example                            |
| ------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------- |
| `--skip-tests`            | Don't generate test files                                                                   | `--skip-tests`                     |
| `--skip-types`            | Don't generate types.ts                                                                     | `--skip-types`                     |
| `--with-form`             | Add \*Form.vue (for CMS editor blocks)                                                      | `--with-form`                      |
| `--with-view`             | Add View.vue (for settings panels)                                                          | `--with-view`                      |
| `--with-toolbar`          | Add ToolbarTrigger.vue (for settings)                                                       | `--with-toolbar`                   |
| `--complex-form`          | With `--with-form`: scaffold `forms/`+`partials/` instead of one Form.vue                   | `--complex-form`                   |
| `--structure`             | With `--with-form`: scaffold a structure/container block instead of a content block         | `--structure`                      |
| `--category=<value>`      | With `--with-form`: the block's CMS editor category                                         | `--category=cards`                 |
| `--access-control=<list>` | With `--with-form`: comma-separated editor contexts (`content`,`productCategory`,`product`) | `--access-control=content,product` |
| `--dry-run`               | Preview planned files without writing anything                                              | `--dry-run`                        |

## Examples

```bash
# Standard component
npm run generate:component ProductCard

# Composable
npm run generate:composable useShoppingCart

# Block for CMS editor (includes --with-form automatically)
npm run generate:block ImageCarousel

# Block with an explicit category and editor contexts (otherwise prompted interactively)
npm run generate:block -- ImageCarousel --category=media --access-control=content,product

# Block with a multi-file form (forms/ + partials/) instead of one Form.vue
npm run generate:block -- ImageCarousel --complex-form

# Structure/container block (holds other blocks as children, like MultiGrid/Carousel)
npm run generate:block -- ColumnLayout --structure --category=layout

# Settings component (includes --with-view --with-toolbar automatically)
npm run generate:settings ShippingOptions

# Skip tests
npm run generate:component -- MyWidget --skip-tests
```

## Content Blocks vs. Structure Blocks

Every CMS block is one of two shapes — pick based on what the block holds:

- **Content block** (default): `content` is a settings object the block itself renders (text, an
  image, a button link). Most blocks are this shape (e.g. `Image`, `TextCard`).
- **Structure block** (`--structure`): `content` is an array of _other_ blocks the CMS user arranges
  as children (e.g. `MultiGrid`, `Carousel`). Use this only when the block is a container whose job
  is to lay out other blocks, not to render its own settings.

`--structure` changes `defaults.ts`'s `type` (`'structure'` vs `'content'`) and `content`'s shape
(`content: []` seeded with real child `Block` instances vs `content: {}`), and `types.ts`'s `content`
type (`Block[]` vs `Record<string, unknown>`). Placement under a `components/blocks/structure/`
subdirectory is a convention some real blocks follow, not a requirement — discovery works at any
depth under `blocks/`.

## After Generating a Block

`--with-form` also scaffolds `defaults.ts` (with a non-empty `accessControl`, so the block is
never accidentally invisible in the CMS editor) and a generic placeholder `icon.svg` used by the
"Add Block" picker. Replacing `icon.svg` with a real, block-specific icon is a nice-to-have polish
step — not required. The block works correctly with the placeholder either way, since the picker
falls back to a plain box when a block has no icon at all.

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

**Block (`--with-form`):**

```
BlockName/
├── BlockName.vue
├── BlockNameForm.vue
├── defaults.ts
├── icon.svg
├── types.ts
└── __tests__/BlockName.spec.ts
```

**Block with `--complex-form`** replaces the single `BlockNameForm.vue` (orchestrator only) with
`forms/BlockNameSettingsForm.vue` + `partials/BlockNameSectionEditor.vue` (and matching
`__tests__/` specs), matching the real `UtilityBar` block's structure.
