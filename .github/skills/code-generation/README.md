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

## Available Flags

| Flag                 | Description                      | Example                           |
| -------------------- | -------------------------------- | --------------------------------- |
| `--skip-tests`       | Don't generate test files        | `--skip-tests`                    |
| `--skip-types`       | Don't generate types.ts          | `--skip-types`                    |
| `--with-form`        | Create \*Form.vue for CMS editor | `--with-form`                     |
| `--with-view`        | Create View.vue for settings     | `--with-view`                     |
| `--with-toolbar`     | Create ToolbarTrigger.vue        | `--with-toolbar`                  |
| `--output-path=path` | Custom output location           | `--output-path=components/blocks` |

## Examples

**Standard component:**

```bash
npm run generate:component ProductCard
# Result: apps/web/app/components/ProductCard/
```

**Block component for CMS:**

```bash
npm run generate:block VideoPlayer --with-form
# Result: apps/web/app/components/blocks/VideoPlayer/
# Remember to register in utils/blocks-imports.ts
```

**Settings component:**

```bash
npm run generate:settings LanguagePreferences --with-view --with-toolbar
# Result: apps/web/app/components/settings/general/LanguagePreferences/
# Remember to register in utils/settings-groups-imports.ts
```

**Composable:**

```bash
npm run generate:composable useProductSearch
# Result: apps/web/app/composables/useProductSearch/
```

## Naming Conventions

**Components:** PascalCase (e.g., `ProductCard`, `ShoppingCart`)
**Composables:** camelCase with `use` prefix (e.g., `useCart`, `useWishlist`)

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

## Direct Script Usage

For advanced usage, call the script directly:

```bash
.github/skills/code-generation/generate.sh component ProductCard
.github/skills/code-generation/generate.sh composable useCart
```

## Troubleshooting

**"File already exists" error:**

- Choose a different name or remove the existing component/composable

**"Invalid name" error:**

- Components must be PascalCase: `ProductCard` ✅ not `product-card` ❌
- Composables must start with `use`: `useCart` ✅ not `cart` ❌

**"Invalid output path" error:**

- Use relative paths only
- Must start with allowed prefix (components, composables, pages, etc.)
- No directory traversal (`..`) allowed

## CI/CD

The generation script is validated via shellcheck in the CI/CD pipeline. Changes to `generate.sh` are automatically linted on every PR.

## Security

The script includes multiple security layers:

- Input validation (regex patterns)
- Path whitelisting (only allowed directories)
- No command injection (direct npx calls)
- Error cleanup (removes partial files on failure)
