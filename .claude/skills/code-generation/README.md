# Code Generation Tool

User-facing documentation for the PlentyONE Shop code generation system.

## Quick Start

Generate new components or composables using npm shortcuts:

```bash
# Generate a component
npm run generate:component ProductCard

# Generate a composable
npm run generate:composable useShoppingCart

# Generate a block component (CMS)
npm run generate:block ImageBanner

# Generate a settings component (admin)
npm run generate:settings ShippingOptions
```

## Passing Additional Flags

Use `--` to pass flags through npm:

```bash
npm run generate:component -- ProductCard --skip-tests --with-form
```

## Naming Conventions

**Components:** PascalCase (e.g., `ProductCard`, `ShoppingCart`)
**Composables:** camelCase with `use` prefix (e.g., `useCart`, `useWishlist`)

## Available Flags

| Flag                      | Description                                                                   | Example                            |
| ------------------------- | ----------------------------------------------------------------------------- | ---------------------------------- |
| `--skip-tests`            | Don't generate test files                                                     | `--skip-tests`                     |
| `--skip-types`            | Don't generate types.ts                                                       | `--skip-types`                     |
| `--with-form`             | Create \*Form.vue for CMS editor                                              | `--with-form`                      |
| `--with-view`             | Create View.vue for settings                                                  | `--with-view`                      |
| `--with-toolbar`          | Create ToolbarTrigger.vue                                                     | `--with-toolbar`                   |
| `--complex-form`          | With `--with-form`: scaffold `forms/`+`partials/` instead of one Form.vue     | `--complex-form`                   |
| `--structure`             | With `--with-form`: scaffold a structure/container block, not a content block | `--structure`                      |
| `--category=<value>`      | With `--with-form`: the block's CMS editor category                           | `--category=cards`                 |
| `--access-control=<list>` | With `--with-form`: comma-separated editor contexts                           | `--access-control=content,product` |
| `--dry-run`               | Preview planned files without writing anything                                | `--dry-run`                        |

## Examples

**Standard component:**

```bash
npm run generate:component ProductCard
# Result: apps/web/app/components/ProductCard/
```

**Block component for CMS:**

```bash
npm run generate:block -- VideoPlayer --category=media --access-control=content,product
# Result: apps/web/app/components/blocks/VideoPlayer/
# Includes VideoPlayerForm.vue, defaults.ts, and icon.svg automatically (--with-form flag)
# Auto-discovered by the CMS editor via blocks-imports.ts's import.meta.glob - no manual registration needed
# icon.svg is a generic placeholder - replace with a real icon when convenient (not required)
```

**Content block vs. structure block:** pick `--structure` only when the block is a container that
holds _other_ blocks as children (like `MultiGrid`/`Carousel`) — it scaffolds `content` as a
`Block[]` array instead of a settings object, and `type: 'structure'` instead of `'content'`. Most
blocks are content blocks (the default, no flag needed).

```bash
npm run generate:block -- ColumnLayout --structure --category=layout
# defaults.ts: type: 'structure', content: [] (seed with real child Block instances)
# types.ts: content: Block[]
```

**Settings component:**

```bash
npm run generate:settings LanguagePreferences
# Result: apps/web/app/components/LanguagePreferences/
# Includes View.vue and ToolbarTrigger.vue automatically
# Move to components/settings/<group>/ if needed
# Remember to register in utils/settings-groups-imports.ts
```

**Composable:**

```bash
npm run generate:composable useProductSearch
# Result: apps/web/app/composables/useProductSearch/
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

`--complex-form` replaces the single `BlockNameForm.vue` (orchestrator only) with
`forms/BlockNameSettingsForm.vue` + `partials/BlockNameSectionEditor.vue` (and matching
`__tests__/` specs), matching the real `UtilityBar` block's structure.

## Direct Script Usage

For advanced usage, call the script directly:

```bash
.claude/skills/code-generation/generate.sh component ProductCard
.claude/skills/code-generation/generate.sh composable useCart
```

## Troubleshooting

**"File already exists" error:**

- Choose a different name or remove the existing component/composable

**"Invalid name" error:**

- Components must be PascalCase: `ProductCard` ✅ not `product-card` ❌
- Composables must start with `use`: `useCart` ✅ not `cart` ❌

## CI/CD

The generation script is validated via shellcheck in the CI/CD pipeline. Changes to `generate.sh` are automatically linted on every PR.

## Security

The script includes multiple security layers:

- Input validation (regex patterns)
- Path whitelisting (only allowed directories)
- No command injection (direct npx calls)
- Error cleanup (removes partial files on failure)
