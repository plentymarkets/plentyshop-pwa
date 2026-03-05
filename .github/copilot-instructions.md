# PlentyONE Shop PWA - AI Coding Instructions

## Architecture Overview

This is a **Turborepo monorepo** with two main apps:

- `apps/web/` - Nuxt.js 3 PWA frontend with TypeScript
- `apps/server/` - Alokai middleware server for PlentyONE integration

The project integrates **PlentyONE** e-commerce backend via **Alokai SDK** (@plentymarkets/shop-api, @plentymarkets/shop-core).

## Essential Workflows

### Development Commands

```bash
npm run dev          # Start both frontend and middleware
npm run build        # Build both apps via Turbo
npm run test         # Run all tests (Vitest)
npm run test:cypress # Run Cypress E2E tests
npm run lint:fix     # Auto-fix linting issues
```

### Environment Setup

- Copy `apps/web/.env.example` to `apps/web/.env`
- Set `API_ENDPOINT` (PlentyONE system URL) and `API_SECURITY_TOKEN`
- The middleware reads web app's `.env` file (see `middleware.config.ts`)
- **Production caveat**: `apps/web/.env` is only available at build time, not runtime. You cannot use Nuxt's auto-substitution in `nuxt.config.ts` for production builds

### Terminal Setup

- Run `nvm install` once per new terminal session to ensure the correct Node.js version is active

## Key Patterns & Conventions

### Component Architecture

- **Atomic design**: Components in logical folders (`AddressForm/`, `ProductAccordion/`)
- **Composition API**: All components use `<script setup>` with TypeScript
- **Props typing**: Define interfaces in `types.ts` files alongside components
- **StorefrontUI**: Uses SFUI components with TailwindCSS styling
- **Dynamic blocks**: `components/blocks/` contains CMS-like content blocks (Image, TextCard, etc.) loaded via `utils/blocks-imports.ts`
- **Settings system**: `components/settings/` contains admin configuration components dynamically imported via `utils/settings-groups-imports.ts` and `utils/triggers-imports.ts`

### State Management

- **Composables pattern**: Business logic in `composables/` (e.g., `useCustomer`, `useCart`)
  - **Auto-import**: Composables in `composables/` are automatically available—no imports needed
  - Simply call the composable directly in components: `const { method } = useMyComposable(options)`
- **State persistence**: `useState()` for reactive state across components
- **Event system**: Custom `usePlentyEvent()` for cross-module communication

### API Integration

- **Middleware layer**: Server app proxies requests to PlentyONE API
- **SDK methods**: Use `@plentymarkets/shop-api` for all backend calls
- **Error handling**: Custom error handler preserves PlentyONE response format

### Routing & i18n

- **File-based routing**: Pages in `pages/` directory
- **Dynamic routes**: Product/category pages use PlentyONE item/category IDs
- **Nuxt-i18n**: Multi-language support with configuration in `configuration/i18n.config.ts`
- **Auto-import**: The `t` function is auto-imported from a custom wrapper composable in the `@plentymarkets/shop-core` package
- **Admin views translations**: Components in `components/settings/` and `components/blocks/**/*Form.vue` use `getEditorTranslation()` for admin panel translations and are always in English, even if the shop frontend is in another language.

**CRITICAL: Admin Component Translation Convention**
- Both `"en"` and `"de"` language keys must contain **English text only** (no German translations)
- This applies to all `<i18n>` blocks in form components (e.g., `UtilityBarSearchForm.vue`)
- Example:
  ```json
  {
    "en": {
      "label": "Show Icon Only"
    },
    "de": {
      "label": "Show Icon Only"
    }
  }
  ```
- This unconventional pattern is intentional and allows admin panels to remain in English across all language settings

### Dynamic Component System

- **Block system**: CMS-like content blocks in `components/blocks/` (Image, TextCard, BannerCarousel)
- **Settings panels**: Admin configuration components in `components/settings/` with nested folder structure
- **Auto-discovery**: Three utils automatically discover and load components from core, modules, and customer locations:
  - `utils/blocks-imports.ts` - loads content blocks by name via `getBlockLoader()`
  - `utils/settings-groups-imports.ts` - groups settings components by folder structure
  - `utils/triggers-imports.ts` - loads toolbar trigger components ending in `*ToolbarTrigger.vue`

## Testing Strategy

- **Unit tests**: Vitest with Vue Test Utils in `__tests__/` directories
  - **Component tests**: Use `@vue/test-utils` `mount()` for isolated Vue component testing
  - **Composable tests**: Use `@nuxt/test-utils/runtime` `mockNuxtImport()` to mock Nuxt-specific functions like `useRuntimeConfig`, `useSdk`, etc.
- **E2E tests**: Cypress with specialized suites (`test:cypress-checkout`, `test:cypress-editor`)
- **Type checking**: `vue-tsc` for compile-time TypeScript validation

## Critical Files to Understand

- `apps/web/nuxt.config.ts` - Main Nuxt configuration
- `apps/server/middleware.config.ts` - Alokai middleware setup
- `apps/web/app/composables/` - Business logic and API interactions
- `turbo.json` - Monorepo task pipeline configuration

## Common Gotchas

- Environment variables must be set in `apps/web/.env` (not root)
- Turbo cache may need clearing: `npm run clean` for node_modules, `npm run clean:hard` for full reset
- Components auto-import from `components/` - no manual imports needed
- PWA features require HTTPS in production (configured in `nuxt.config.ts`)

## TypeScript Strict Mode Rules

- **NEVER use `as any` or implicit `any` types** - The project enforces `noImplicitAny: true`
- Always provide explicit types using interfaces or imported types
- Use proper type inference or type assertions with specific types instead

## Vue & Nuxt Auto-Imports Rules

- **NEVER import from `vue` directly** - The project has a linting rule that blocks direct `vue` imports
- Nuxt automatically imports all Vue composables and functions: `ref`, `computed`, `watch`, `onMounted`, `onUnmounted`, `reactive`, `toRef`, `toRefs`, etc.
- Just use them directly without imports:
  ```typescript
  // ❌ WRONG - Will cause linting error
  import { computed, ref } from 'vue';
  const count = ref(0);
  const doubled = computed(() => count.value * 2);

  // ✅ CORRECT - Use without imports
  const count = ref(0);
  const doubled = computed(() => count.value * 2);
  ```
- This applies to both components and composables
- Error message if you try to import from vue: `'vue' import is restricted from being used by a pattern. Use Nuxt auto-imports instead of importing from vue directly.`

## Code Readability & Naming Conventions

### Variable Naming

- **Use full, descriptive names** - Never abbreviate parameter names just to save characters
  - ✅ `set: (value) =>` not `set: (v) =>`
  - ✅ `forEach((section) =>` not `forEach((s) =>`
  - ✅ `map((item) =>` not `map((i) =>`
  - ✅ `filter((user) =>` not `filter((u) =>`

- **Avoid single-letter variables** except in:
  - Loop indices: `for (let i = 0; i < length; i++)`
  - Mathematical operations: `const total = a + b + c` (where a, b, c have clear context)
  - Destructured parameters when context is obvious: `[x, y]` for coordinates

- **Use meaningful callback parameters** - The parameter name should describe what it represents
  - ✅ `items.map((item) => item.id)` - Clear what we're mapping over
  - ❌ `items.map((x) => x.id)` - Unclear

### Computed Properties & Getters/Setters

- **Always use full parameter names** in computed property setters:
  ```typescript
  // ✅ GOOD
  const configuration = computed<ConfigType>({
    get: () => source.value.configuration || defaultConfig,
    set: (newConfiguration: ConfigType) => {
      if (source.value) {
        source.value.configuration = newConfiguration;
      }
    },
  });

  // ❌ BAD
  const configuration = computed<ConfigType>({
    get: () => source.value.configuration || defaultConfig,
    set: (v) => {
      if (source.value) {
        source.value.configuration = v;
      }
    },
  });
  ```

- **Callback functions should have explicit names:**
  ```typescript
  // ✅ GOOD
  sections.forEach((section) => {
    visibility[section.id] = section.visible !== false;
  });

  // ❌ BAD
  sections.forEach((s) => {
    visibility[s.id] = s.visible !== false;
  });
  ```

### Comments for Complex Logic

- **Add brief comments** for non-obvious computed property behavior:
  ```typescript
  const sections = computed({
    get: () => {
      // Map section IDs to section objects with visibility state
      const order = configuration.value.sectionOrder?.sections || ['logo', 'search', 'actions'];
      return order.map((id) => ({
        id,
        visible: configuration.value.sectionVisibility?.[id] !== false,
      }));
    },
  });
  ```

- **Explain the "why"** for non-intuitive null checks or defaults:
  ```typescript
  // Ensure section visibility is initialized with all sections visible by default
  if (!configuration.value.sectionVisibility) {
    configuration.value.sectionVisibility = { logo: true, search: true, actions: true };
  }
  ```

## Summary

**Golden Rule**: Write code as if someone unfamiliar with this file will read it in 6 months. Prioritize clarity over brevity.