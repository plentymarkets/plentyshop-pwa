# AGENTS.md

This file provides guidance for LLM coding tools when working with this repository. Run `npm run llm:link all` to link it to provider-specific files (e.g. `CLAUDE.md`, `GEMINI.md`).

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

# E2E tests (Cypress) — requires API_ENDPOINT in apps/web/.env; each spins up `npm run start` first
npm run test:cypress                # paypal + dhl + feature + checkout + editor specs
npm run test:cypress-dev            # Open Cypress UI
npm run test:cypress-smoke-shop     # Shop smoke suite only
npm run test:cypress-smoke-editor   # Editor smoke suite only
npm run test:cypress-quarantine     # Flaky/quarantined specs

# Lint / Typecheck / Format
npm run lint
npm run lint:fix
npm run typecheck      # vue-tsc --noEmit (also runs as a build dependency)
npm run format         # prettier --check
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
  - `ui/` — Generic StorefrontUI block components (shop base components)
  - `editor/` — CMS/editor base components
  - `blocks/` — CMS-style content blocks (dynamically loaded)
  - `settings/` — Admin configuration panels
- **`composables/`** — All business logic (140+). Same folder structure as components. State via `useState()` for SSR safety.
- **`pages/`** — File-based routing
- **`configuration/`** — i18n, `app.config.ts`, `feature-flags.config.ts`, `settings.config.ts`, `tailwind.config.ts`, `block-layout.config.ts`, `security.config.ts`
- **`utils/blocks/blocks-imports.ts`** — Dynamic block loader (maps block name → async import) via `getBlockLoader()`
- **`utils/settings-groups-imports/`** — Auto-discovers admin settings panels
- **`utils/triggers-imports/`** — Auto-discovers toolbar trigger components
- **`lang/`** — 26 locale JSON files (`en.json`, `de.json`, …)

### State Management

No global store. All state lives in composables via Nuxt's `useState()` (SSR-safe).

- **Parent ↔ child:** props and events.
- **Cross-component / cross-module:** composables, or `usePlentyEvent` from `@plentymarkets/shop-core`.

### i18n

26 languages in `app/lang/`. Use `t()` for frontend strings — never the global `$t`/`$n`/`n` (see Enforced constraints). Admin components (in `settings/` and `blocks/**/*Form.vue`) always use English via `getEditorTranslation()`.

### Dynamic Blocks

CMS blocks are loaded lazily by name via `getBlockLoader()` from `utils/blocks/blocks-imports.ts`. Any new block component must be registered there.

## Code Style

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

- **Give complex types a dedicated `interface`/`type`** rather than inlining. Prop types are suffixed `Props` (e.g. `GalleryProps`, `HeadingProps`). All types belong in `types.ts` (see Enforced constraints).

### Enforced constraints (custom ESLint rules + restricted imports)

These are enforced by `apps/web/eslint.config.mjs` (custom rules in `apps/web/eslint-rules/`) and fail lint — write code that respects them up front, and don't flag them in review since tooling already catches them:

- **No direct `vue` imports** — use Nuxt auto-imports (`ref`, `computed`, etc. are global). Type-only imports from `vue` are allowed.
- **No `SfButton` / `SfLink` from `@storefront-ui/vue`** — use `UiButton` / `UiLink` instead (they conform to the design system).
- **No `structuredClone`** — it strips Vue reactivity. Use `deepClone()` (auto-imported from `utils/jsonHelper.ts`) for plain data, or `toRaw()` on reactive objects.
- **No global i18n** (`$t`, `$n`, `n`) — use `t()` (`no-i18n-globals`).
- **All TS types/interfaces live in `types.ts` files**, and `types.ts` may only contain type/interface declarations (`file-organization-types`).
- **Barrel `index.ts` files must use `export *`, not named re-exports** — named re-exports cause Nuxt auto-import to double-register and warn (`no-named-reexport-in-barrel`).
- **z-index only via semantic tokens** — no `z-10`/`z-50`/`z-[200]`; use the named scale in `tailwind.config.ts → theme.extend.zIndex` (`enforce-z-index-tokens`, applies to `.vue` files).
- **Container queries, not bare responsive prefixes** — inside `pages/`, `layouts/`, and most of `components/` (rendered in the `@container` from `app.vue`), use `@md:`/`@lg:` not `md:`/`lg:` (`no-bare-responsive-in-container`; settings/editor panels and `*Form.vue` are exempt).
- **One statement per template event handler** — `@click="a(), b()"` → extract to a single method (`no-multiple-template-callbacks`).

### Tailwind values — no arbitrary hardcoded values in classes

Avoid arbitrary value classes like `text-[11px]`, `max-w-[1400px]`, `shadow-[0_0_16px_rgba(0,0,0,0.12)]`, `grid-cols-[minmax(280px,360px)_1fr]`. Resolve them in this order:

1. **Predefined Tailwind class** if an exact match exists (e.g. `text-2xs` is already defined in `apps/web/app/configuration/tailwind.config.ts` as 11px → use `text-2xs`).
2. **Closest predefined class** if it doesn't change the design significantly (e.g. `text-[13.5px]` → `text-sm` (14px), `tracking-[0.08em]` → `tracking-widest` (0.1em), `scale-[1.03]` → `scale-105`, `max-w-[1400px]` → `max-w-screen-2xl`).
3. **Extend `tailwind.config.ts`** only as a last resort, when no close-enough class exists (e.g. uniform shadows, complex grid templates, calc-based max-height with CSS vars). Pick a semantic name (`shadow-card-hover`, `grid-cols-search-dropdown`, `max-h-dropdown`) and add it under the appropriate `theme.extend.*` key.

Predefined Tailwind classes and existing config entries always take priority over adding new config or using arbitrary values.

## Vue / Nuxt Patterns

See `docs/_styleguide/design.guide.md` for additional guidance.

- **Keep components presentational and single-responsibility.** Abstract business logic into composables or modules, not components.
- **Composables** hold stateful logic and anything needing the Vue/Nuxt lifecycle or app context. **Modules** hold stateless, pure functions with no lifecycle/app dependency.
  - A module tightly coupled to one composable lives in that composable's directory; a generic, reusable module lives in `utils/`.
- **Prefer `@storefront-ui/vue` components** for design consistency (except `SfButton`/`SfLink` — see Enforced constraints). Create additional base components in `components/ui` (shop) or `components/editor` (cms) to promote reuse.
- **Lean on Nuxt auto-imports.** In templates, prefix component names with their folder (e.g. `UiButton` for `components/ui/Button.vue`). Use `defineAsyncComponent` for heavy components that aren't immediately needed.

### Error Handling

- Wrap asynchronous operations that may fail in try-catch.
- Surface errors to users with `useNotification` from `@plentymarkets/shop-core`.

### Blocks / Settings

- When a block's or setting's interface changes, add a data mapping to keep existing data backward-compatible.
- Data mappings must handle missing properties with sensible defaults.

## Testing

### Unit tests (Vitest)

- Tests live in a `__tests__/` directory adjacent to the source they cover. Components, composables, and modules should each have unit tests.
- Mock Nuxt composables with `mockNuxtImport()` from `@nuxt/test-utils/runtime`.
- Use `describe` to group and `it` for individual cases, each named with "should" syntax (e.g. `it('should return X when Y')`); follow Arrange-Act-Assert. Tag component elements with `data-testid` so tests target those over classes or element types.
- Test behavior via the public API, not implementation details: the test should fail when behavior changes but pass when only internals change. Keep tests deterministic and keep test data in fixtures.
- Mock as little as possible. If a unit needs extensive mocking (e.g. lots of state), that's a signal to split stateful logic (composable) from stateless logic (module) so each can be tested independently.
- Coverage thresholds (`vitest.config.ts`): functions & branches 80%, lines & statements 50%.

### E2E tests (Cypress)

- Require a live `API_ENDPOINT`; tests in `apps/web/__tests__/test/`, covering critical user flows.
- Suites: `smoke/`, `checkout/`, `feature/`, `paypal/`, `dhl/`, `editor/`, `quarantine/`, `post-quarantine/`, `unit/`.
- Each test covers a complete user journey — don't fragment it; use unit tests for individual components or pages.
- The Page Object pattern encapsulates page-specific selectors and actions; chain assertions fluently for readability.

## Documentation

- Add TSDoc comments to all public functions, classes, and complex types.
- Ensure comments are clear, concise, and provide value beyond what the code itself conveys.
