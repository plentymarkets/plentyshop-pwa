# How to create a block

## Overview

This guide explains how to create a new CMS block so merchants can add it to a page from the editor's "Add block" catalogue.

Create a new block when you need a piece of storefront content that doesn't exist yet — a custom banner, a specialised grid, a third-party embed. If you only need to change how an existing block looks or behaves in your fork of this repository, edit that block directly instead of creating a new one; overriding from a separate Nuxt module is a different workflow, covered in [Add or override a block from a module](/guide/modules/blocks.md).

::: info Using coding agents?
The `.claude/skills/designing-cms-blocks` and `.claude/skills/implementing-cms-blocks` skills automate the flow this guide describes by hand — one turns a request or mock into a spec, the other builds it. See `.claude/skills/design-implement-cms-blocks.html` for an overview of how the two fit together.

If you use a different AI coding tool (Codex, Gemini CLI, GitHub Copilot), run `npm run llm:link all` first to make the same skills available there.
:::

## Before you start

Before you create a block, ensure:

- You understand the [blocks architecture](/guide/editor/blocks-architecture.md) — in particular the fetch-assemble-render-save cycle and the discovery mechanism.
- You have decided whether the block is a [content block or a structure block](/guide/editor/blocks-structure-vs-content.md). Content blocks render their own settings (text, an image, a button). Structure blocks are containers whose `content` is an array of other blocks (like `MultiGrid` or `DetailsList`). This guide covers both.
- You know which editor contexts the block should be available in: `content` (content categories and the homepage), `productCategory`, and/or `product`. This becomes the block's `accessControl`.

## Scaffold the block

Run the generator from the repository root:

```bash
# Content block (default)
npm run generate:block Callout

# Structure block
npm run generate:block -- ColumnLayout --structure --category=layout

# Guided setup
npx plentyshop generate
```

Both commands accept `--category` and `--access-control` to skip the interactive prompts, and `--complex-form` if the form needs multiple files under `forms/`/`partials/` instead of a single `Form.vue`. See `packages/shop-cli/README.md` for the full flag reference.

Either command scaffolds a new folder under `apps/web/app/components/blocks/<Name>/`:

```
Callout/
├── Callout.vue
├── CalloutForm.vue
├── defaults.ts
├── types.ts
├── icon.svg
└── __tests__/
    ├── Callout.spec.ts
```

No manual registration step follows. The block loader picks up any `.vue`/`defaults.ts` file under a `blocks/` path segment automatically — see [Blocks discovery and overrides](/guide/editor/blocks-discovery.md) for the mechanism.

## Build a content block

Use this walkthrough for a block whose `content` is a settings object the block renders itself, such as the `Callout` example above.

1. **Define the settings shape in `types.ts`.**

   ```ts
   // components/blocks/Callout/types.ts
   export type CalloutContent = {
     text: string;
     variant: 'info' | 'warning';
   };

   export type CalloutProps = {
     content: CalloutContent;
   };
   ```

2. **Render the block in `Callout.vue`**, reading settings from `content` via props.

3. **Build the editor form in `CalloutForm.vue`.** This is the panel merchants see in the settings drawer — inputs here read and write the same `content` object rendered in step 2.

4. **Register the catalogue entry in `defaults.ts`.** `getBlocksList()` is what makes the block appear in the "Add block" picker. Every block needs at least one `en`/`de` template variation with real default content — merchants see this content the moment they insert the block, before touching the form:

   ```ts
   // components/blocks/Callout/defaults.ts
   import { v4 as uuid } from 'uuid';
   import type { Block } from '@plentymarkets/shop-api';
   import type { BlocksList } from '~/composables/useBlocksList/types';

   export const getBlocksList = (): BlocksList => ({
     callout: {
       category: 'callout',
       title: 'Callout',
       blockName: 'Callout',
       accessControl: ['content', 'productCategory', 'product'],
       variations: [
         {
           title: 'Callout',
           template: {
             en: {
               name: 'Callout',
               type: 'content',
               meta: { uuid: uuid() },
               content: { text: 'Add your message here.', variant: 'info' },
             },
             de: {
               name: 'Callout',
               type: 'content',
               meta: { uuid: uuid() },
               content: { text: 'Fügen Sie hier Ihre Nachricht ein.', variant: 'info' },
             },
           },
         },
       ],
     },
   });
   ```

   The `name` on each `template` must match the block's Vue filename (`Callout`) — the renderer and the module override system both key off it. `accessControl` gates which page types the block can be added to; an empty array hides it from the catalogue entirely.

5. **Replace `icon.svg`** with a block-specific icon for the catalogue button. This is a polish step — the generated placeholder works fine until you get to it.

## Build a structure block

Use this walkthrough for a block that holds other blocks as children, such as the `ColumnLayout` example above. `DetailsList` (`components/blocks/DetailsList/`) is a real block built this way and is worth reading alongside this section.

The shape differs from a content block in three places:

- **`types.ts`** — `content` is `Block[]`, not a settings object.
- **`defaults.ts`** — `type` is `'structure'`, and the template's `content` is an array seeded with one or more real child `Block` instances (not `{}`):

  ```ts
  // components/blocks/ColumnLayout/defaults.ts
  const createColumn = (): Block => ({
    name: 'TextCard',
    type: 'content',
    meta: { uuid: uuid() },
    content: { text: { htmlDescription: '<p>Column content</p>', textAlignment: 'left', color: '#000' } },
  });

  const createColumnLayout = (): Block => ({
    name: 'ColumnLayout',
    type: 'structure',
    meta: { uuid: uuid() },
    content: [createColumn(), createColumn()],
  });
  ```

- **`ColumnLayout.vue`** — iterates `content` and renders each child through the shared block renderer, rather than rendering its own settings.

`ColumnLayoutForm.vue` still applies the same way as for a content block — it configures the structure block itself (layout, visibility), not its children. Children get their own form when the merchant selects them individually.

## Verify it locally

1. Restart the dev server (`npm run dev`) so Nuxt picks up the new files.
2. [Enable editor mode locally](/guide/editor/editor-mode.md) if you haven't already.
3. Open a blockified page (the homepage, a product page, or a content category) and open the "Add block" catalogue. Your block's title and icon should appear under the category you set in `defaults.ts`, filtered by the page's `accessControl` context.
4. Insert it, confirm the default content renders correctly, then open its settings drawer and confirm the form reads and writes the same fields.

## Test it

The generator scaffolds `__tests__/<Name>.spec.ts` and `__tests__/<Name>Form.spec.ts` alongside the block. Fill these in following the project's unit testing conventions (see the root `CLAUDE.md`): mock only what the component needs, target elements via `data-testid`, and assert behavior through props/emits rather than internals.

## See also

- [Blocks architecture](/guide/editor/blocks-architecture.md) — the fetch-assemble-render-save cycle this block participates in
- [Blocks discovery and overrides](/guide/editor/blocks-discovery.md) — how the loader finds this block automatically
- [Structure vs. content form](/guide/editor/blocks-structure-vs-content.md) — the distinction this guide builds on
- [Control block visibility](/guide/editor/blocks-visibility.md) — hiding a block or its children under certain conditions
- [Add or override a block from a module](/guide/modules/blocks.md) — the equivalent workflow from inside a Nuxt module instead of this repository
