# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

PlentyONE Shop PWA is a Turborepo monorepo providing a headless e-commerce frontend built with Nuxt 4, Vue 3, TypeScript, TailwindCSS, and Storefront UI 2. It connects to PlentyONE backend via the Alokai SDK and middleware.

**Workspaces:**

- `apps/web/` — Nuxt 4 PWA frontend (srcDir: `app/`)
- `apps/server/` — Alokai Middleware (Express.js), reads env from `apps/web/.env`
- `packages/shop-cli/` — PlopJS-based code generator

## Commands

```bash
# Dev (both frontend + middleware concurrently)
npm run dev

# Build / Start
npm run build && npm run start

# Unit tests (Vitest)
npm run test
npm run test:watch
npm run test:coverage

# E2E tests (Cypress) — requires API_ENDPOINT in apps/web/.env
npm run test:cypress
npm run test:cypress-dev        # Open Cypress UI
npm run test:cypress-checkout   # Checkout suite only

# Lint / Format
npm run lint
npm run lint:fix
npm run format:fix

# Clean
npm run clean          # Clear build artifacts
npm run clean:hard     # Full reset (node_modules, .nuxt, .turbo, dist)

# Code generation
npm run generate:component
npm run generate:composable
```

To run a single unit test file: `npm run test -- --run path/to/file.spec.ts`

Node version is specified in `.nvmrc`.

## Architecture

### Frontend (`apps/web/app/`)

- **`components/`** — 120+ Vue components. Each lives in its own folder: `ComponentName/ComponentName.vue`, `ComponentName/types.ts`, `ComponentName/index.ts`, `ComponentName/__tests__/ComponentName.spec.ts`
  - `ui/` — Generic StorefrontUI block components
  - `blocks/` — CMS-style content blocks (dynamically loaded)
  - `settings/` — Admin configuration panels
- **`composables/`** — All business logic. Same folder structure as components. State via `useState()` for SSR safety; exposed as `readonly()`.
- **`pages/`** — File-based routing
- **`configuration/`** — i18n, app config, feature flags, settings config
- **`utils/blocks-imports.ts`** — Dynamic block loader (maps block name → async import)
- **`utils/settings-groups-imports.ts`** — Auto-discovers admin settings panels
- **`utils/triggers-imports.ts`** — Auto-discovers toolbar trigger components

### State Management

No global store. All state is in composables using `useState()`. Cross-module communication uses `usePlentyEvent()`.

### i18n

18+ languages in `app/lang/`. Use `t()` for frontend strings. Admin components (in `settings/` and `blocks/**/*.vue`) always use English via `getEditorTranslation()`.

### Dynamic Blocks

CMS blocks are loaded lazily by name via `getBlockLoader()` from `utils/blocks-imports.ts`. Any new block component must be registered there.

## Testing Conventions

**Unit tests (Vitest):**

- Tests in `__tests__/` alongside source files
- Mock Nuxt composables with `mockNuxtImport()` from `@nuxt/test-utils/runtime`
- Test names follow `it('should ...')` pattern
- Coverage thresholds: 80% functions/branches

**E2E tests (Cypress):**

- Require live `API_ENDPOINT`; tests in `apps/web/__tests__/test/`
- Suites: `smoke/`, `checkout/`, `feature/`, `paypal/`, `dhl/`, `editor/`, `quarantine/`

### Code style

- **No magic string literals in code.** String values with semantic meaning that appear in comparisons or are referenced from multiple places (block names, event names, route keys, status enums, etc.) must live as exported constants in a dedicated module — not hardcoded inline. Re-use the constant everywhere the value is referenced.
  ```ts
  // ❌  if (block.name === 'UtilityBar') { ... }
  // ❌  if (block.name === 'Header') { ... }
  // ✅
  import { HEADER_BLOCK_NAME, UTILITY_BAR_BLOCK_NAME } from '~/utils/blocks/block-names';
  if (block.name === UTILITY_BAR_BLOCK_NAME) { ... }
  if (block.name === HEADER_BLOCK_NAME) { ... }
  ```
  Block-name constants live in `apps/web/app/utils/blocks/block-names.ts`. Add to that file when introducing a new block-name reference. For other categories (event names, etc.), add a similarly-scoped constants module rather than scattering literals.
- **Always brace conditionals and loops**, even one-liners. Format the braces on their own lines.
  ```ts
  // ❌  if (props.close) return;
  // ❌  while (el && el.tagName !== 'HEADER') el = el.parentElement;
  // ✅
  if (props.close) {
    return;
  }
  while (el && el.tagName !== 'HEADER') {
    el = el.parentElement;
  }
  ```
- **Don't over-annotate TypeScript.** If type inference produces the same result and the lint passes without an annotation, omit it. Only add annotations when they're load-bearing (the inferred type is wrong, too wide, or the lint fails without them).

  ```ts
  // ❌  let el: HTMLElement | null = rootRef.value;  // rootRef.value is already HTMLElement | null
  // ✅  let el = rootRef.value;

  // ❌  const x = inject<Ref<HTMLElement | null>>('key', ref(null));  // ref(null) is Ref<null>
  // ✅  const x = inject('key', ref<HTMLElement | null>(null));        // type on the fallback ref
  ```

### Tailwind values — no arbitrary hardcoded values in classes

Avoid arbitrary value classes like `text-[11px]`, `max-w-[1400px]`, `shadow-[0_0_16px_rgba(0,0,0,0.12)]`, `grid-cols-[minmax(280px,360px)_1fr]`. Resolve them in this order:

1. **Predefined Tailwind class** if an exact match exists (e.g. `text-2xs` is already defined in `apps/web/app/configuration/tailwind.config.ts` as 11px → use `text-2xs`).
2. **Closest predefined class** if it doesn't change the design significantly (e.g. `text-[13.5px]` → `text-sm` (14px), `tracking-[0.08em]` → `tracking-widest` (0.1em), `scale-[1.03]` → `scale-105`, `max-w-[1400px]` → `max-w-screen-2xl`).
3. **Extend `tailwind.config.ts`** only as a last resort, when no close-enough class exists (e.g. uniform shadows, complex grid templates, calc-based max-height with CSS vars). Pick a semantic name (`shadow-card-hover`, `grid-cols-search-dropdown`, `max-h-dropdown`) and add it under the appropriate `theme.extend.*` key.

Predefined Tailwind classes and existing config entries always take priority over adding new config or using arbitrary values.


# Code Review Instructions

When reviewing code changes, please adhere to the following guidelines:

## General

- Do NOT suggest changes that are already enforced by ESLint or other automated tools. Cf. `apps/web/.eslintrc.js` for current ESLint configuration and `apps/web/eslint-rules` for custom rules.
- Focus on code quality, readability, maintainability, and adherence to project conventions.
- Ensure that new code follows the established architectural patterns of the project.

## TypeScript

- Types should be defined in a `types.ts` file within the same directory as the component or module they pertain to.
- Complex types should have a dedicated `interface` or `type` instead of inlining the definition.
- If the interface or type defines a prop, it should be suffixed with `Props` (e.g., `UserProps`).

## Vue / Nuxt

- Components should be presentational where possible. Avoid embedding business logic directly within components. See `/docs/styleguide/design.guide.md` for additional guidance.
- Business logic should be abstracted into composables or modules.
- Composables should contain stateful logic and functionality that requires access to the Vue or Nuxt lifecycle or the Nuxt app.
- Modules should contain stateless logic and pure functions that do not depend on Vue or Nuxt lifecycle or app context.
- If a module is tightly coupled to a specific composable, it should be placed within the same directory as that composable.
- If a module is generic and reusable across different parts of the application, it should be placed in the `utils` directory.

- Components should focus on a single responsibility.
- Components should use `@storefront-ui/vue` components where applicable to maintain design consistency.
- Additional base components should be created in `components/ui` (for shop) or `components/editor` (for cms) as needed to promote reusability and consistency.

- Communication between parent-child components should use props and events.
- All other communication between components should be handled via composables or `usePlentyEvent` from `@plentymarkets/shop-core`.
- State should be managed with Nuxt's built-in `useState` composable.

- Nuxt's auto-import feature should be used as much as possible.
- When using components in the template, the name should be prefixed with the folder name (e.g., `UiButton` for `components/ui/Button.vue`).
- Use `defineAsyncComponent` for heavy components that aren't immediately needed.

### Error Handling

- Use try-catch blocks for asynchronous operations that may fail.
- Use `useNotification` from `@plentymarkets/shop-core` to display error messages to users.

### Blocks / Settings

- If the interface of a block or setting changes, a data mapping should ensure backward compatibility with existing data.
- Data mappings should handle missing properties with sensible defaults.

## Tests

- Components, composables, and modules should have unit tests that cover their functionality.
- Components should tag elements with `data-testid` attributes, so that tests can target them over other selectors like classes or element types.

- Tests should be placed in a `__tests__` directory adjacent to the code they are testing.
- Tests should use descriptive names for test cases to clearly indicate what is being tested.
- Tests should follow the Arrange-Act-Assert pattern for clarity.
- Test cases should use `it` blocks for individual assertions and `describe` blocks for grouping related tests. Each case should use "should" syntax to describe expected behavior (e.g., `it(should return X when Y)`).
- Tests should use mocking as little as possible. If extensive mocking is required, consider if the code under test is too tightly coupled and needs refactoring. For example, if a composable requires mocking a lot of state, consider separating stateful and stateless logic into a composable and a module, respectively, so they can be tested independently.
- Tests should avoid testing implementation details. Focus on testing the public API and behavior of the code. In other words, if the behavior of the unit under test changes, the test should fail; if the implementation details change but the behavior remains the same, the test should still pass.
- Tests should be deterministic and not rely on external factors or state.
- Test data should be maintained in fixtures.

- E2E tests should cover critical user flows and interactions.
- Each E2E test should cover a user journey and not be fragmented into multiple smaller tests. For testing individual components or pages, use unit tests instead.
- Page Object pattern should encapsulate page-specific selectors and actions.
- Chain assertions fluently for readability.

## Documentation

- Add TSDoc comments to all public functions, classes, and complex types.
- Ensure that comments are clear, concise, and provide value beyond what the code itself conveys.
