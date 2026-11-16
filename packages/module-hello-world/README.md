# @plentymarkets/hello-world

A minimal example extension that shows how a marketplace extension is structured.

## Usage

Add to `apps/web/nuxt.config.ts`:

```ts
modules: ['@plentymarkets/hello-world'],
```

## Development

Run once after `npm install` (and again after adding composables or components) to get TypeScript support for `#imports` and auto-imports in `src/runtime/`:

```bash
npm run dev:prepare
npm run typecheck
```

## Before publishing

- Replace the placeholder images in `meta/images/` (icons and previews).
- Fill in the documents in `meta/documents/` (changelog, support contact, user guide — EN and DE).
- Publish with the **Publish Module** workflow (use `dryRun` first).
