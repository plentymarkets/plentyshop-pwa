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

## Code Generation & CLI Tools

### Code Generation Skill

**IMPORTANT: When users request to generate components or composables, always reference the Code Generation Skill documentation.**

📋 **Skill Location:** `.github/skills/code-generation/SKILL.md`

**Quick Commands:**

```bash
npm run generate:component ComponentName
npm run generate:composable useFeatureName
npm run generate:block ImageBlock
npm run generate:settings MySettings
```

**When to use:**

- User says: "generate", "create", "scaffold" + "component" or "composable"
- Creating new Vue components or composables
- Setting up blocks (CMS content blocks)
- Creating settings components (admin configuration)

**Interactive workflow:**

- Ask for clarification when type/path is ambiguous
- Validate naming conventions (PascalCase for components, camelCase with `use` prefix for composables)
- Check for conflicts before generating
- Support optional flags: `--skip-tests`, `--skip-types`, `--with-form`, `--with-view`, `--with-toolbar`

**Full documentation:** See [Code Generation Skill](skills/code-generation/SKILL.md) for:

- Complete trigger patterns and examples
- Interactive workflow guidelines
- Path validation rules and security
- Naming conventions and error handling
- Block and settings component workflows

### PlentyONE Shop CLI (Legacy)

The project includes `@plentymarkets/shop-cli` for automated code generation. The Code Generation Skill wraps this CLI for non-interactive use.

**Direct CLI usage (interactive mode):**

```bash
npx plentyshop generate component   # Interactive prompts
npx plentyshop generate composable  # Interactive prompts
```

**Prefer the npm shortcuts above for non-interactive generation with Copilot.**

## Common Gotchas

- Environment variables must be set in `apps/web/.env` (not root)
- Turbo cache may need clearing: `npm run clean` for node_modules, `npm run clean:hard` for full reset
- Components auto-import from `components/` - no manual imports needed
- PWA features require HTTPS in production (configured in `nuxt.config.ts`)
