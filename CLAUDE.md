# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

PlentyONE Shop PWA is a Turborepo monorepo providing a headless e-commerce frontend built with Nuxt 3, Vue 3, TypeScript, TailwindCSS, and Storefront UI 2. It connects to PlentyONE backend via the Alokai SDK and middleware.

**Workspaces:**

- `apps/web/` — Nuxt 3 PWA frontend (srcDir: `app/`)
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

## Environment Setup

Create `apps/web/.env` (see `.env.example`):

```
API_ENDPOINT=https://your-instance.plentymarkets.com
API_SECURITY_TOKEN=your-token
API_URL=http://localhost:3000
DEFAULTLANGUAGE=en
```

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

## Specification Files

Before working on any feature, check `apps/web/docs/` for a corresponding `*-skills.md` spec file:

- `apps/web/docs/table-of-contents-skills.md` — Table of Contents component
- Other `*-skills.md` files follow the same pattern

**Process:** Read the spec file first to understand requirements and file locations, then open and modify only the files listed there. Use the spec as the single source of truth.

## Conventions

- **Commits:** Conventional Commits enforced (`feat`, `fix`, `docs`, `refactor`, `test`, `chore`)
- **Lint:** Zero-warning policy (`--max-warnings 0`)
- **Props:** Define in `types.ts` as `{Component}Props` interface, use `withDefaults(defineProps<Props>(), {...})`
- **Components/composables:** Auto-imported by Nuxt — no manual imports needed
- **Turbo caching:** If seeing stale output, run `npm run clean`

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
