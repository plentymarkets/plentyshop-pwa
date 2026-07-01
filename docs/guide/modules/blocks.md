# Blocks

This guide shows how to contribute a new block, add a block to the editor's "Add block" catalogue, or override a core block from inside a Nuxt module. A Nuxt module can be internal (living in `apps/web/modules/`) or installed as an npm package under `node_modules/`.

For the underlying mechanism, that is, discovery, load order, and override precedence, see [Blocks discovery and overrides](/guide/editor/blocks-discovery.md).

## Before you start

Ensure your module uses the standard runtime folder:

- Internal Nuxt module: `apps/web/modules/<module>/runtime/components/blocks/`
- Installed npm package: `<package>/runtime/components/blocks/`

The loader in the shop only picks up files below one of these paths.

## Add a new block

1. Create a folder for the block under `runtime/components/blocks/`, named exactly like the block's `name` field (for example, `MyBlock`).

2. Add the renderable component `MyBlock.vue` and its paired form component `MyBlockForm.vue` next to it. Both live in the same folder and are picked up together by the loader.

3. Add `icon.svg` in the same folder. The file is loaded raw and inlined into the catalogue button.

4. Add `defaults.ts` that exports `getBlocksList()`:

   ```ts
   import type { BlocksList } from '~/composables/useBlocksList/types';

   export const getBlocksList = (): BlocksList => ({
     'my-block': {
       category: 'my-block',
       title: 'My Block',
       blockName: 'MyBlock',
       accessControl: ['content'],
       variations: [
         {
           title: 'Default',
           image: 'https://example.com/my-block-preview.png',
           template: {
             en: {
               name: 'MyBlock',
               type: 'content',
               meta: { uuid: '00000000-0000-4000-8000-000000000001' },
               content: { text: 'Hello world' },
             },
             de: {
               name: 'MyBlock',
               type: 'content',
               meta: { uuid: '00000000-0000-4000-8000-000000000002' },
               content: { text: 'Hallo Welt' },
             },
           },
         },
       ],
     },
   });
   ```

   The `name` field on each `template` must match the basename of your `.vue` file. This is what the renderer uses to look up the component and what the override system uses to identify a block.

5. Restart the dev server. The block appears in the catalogue for every page context listed in `accessControl`.

### Optional: `createDefault`

If the block also needs a blank factory (for example, so that other blocks can insert it as a child), add a `createDefault` export:

```ts
import type { Block } from '@plentymarkets/shop-api';

export const createDefault = (): Block => ({
  name: 'MyBlock',
  type: 'content',
  meta: { uuid: crypto.randomUUID() },
  content: { text: '' },
});
```

## Override a core block

Overriding a core block usually means replacing both its Vue component and its catalogue entry. Do only what you need, the two are independent.

### Replace the Vue component

1. Create `runtime/components/blocks/<Name>/<Name>.vue` in your module using the same basename as the core block file you want to replace. If the block ships a form, replace `<Name>Form.vue` the same way, in the same folder.

2. Add the override marker as the first meaningful line in each replacement Vue file:

   ```vue
   <!-- @overrides-core-block -->

   <template>
     <!-- your replacement markup -->
   </template>

   <script setup lang="ts">
     // …
   </script>
   ```

   Without the marker, `nuxt build` fails when the `FAIL_BUILD_ON_UNMARKED_BLOCK_OVERRIDES` environment variable is set (CI sets it). Local `nuxt dev` still works, so add the marker before opening a pull request.

Because the loader processes core first and then Nuxt modules, and each `.vue` file overwrites the previous entry keyed by basename, your file replaces the core component everywhere.

### Replace the catalogue entry

1. Add `runtime/components/blocks/<Name>/defaults.ts` and export `getBlocksList()`.

2. Mark the category with `override: true` and use the same block name as the core variation you want to replace:

   ```ts
   import type { BlocksList } from '~/composables/useBlocksList/types';

   export const getBlocksList = (): BlocksList => ({
     text: {
       category: 'text',
       title: 'Text',
       blockName: 'TextCard',
       accessControl: ['content', 'productCategory', 'product'],
       override: true,
       variations: [
         {
           title: 'Rich Text (customised)',
           image: 'https://example.com/my-preview.png',
           template: {
             en: {
               name: 'TextCard', // must match the core block name
               type: 'content',
               meta: { uuid: '00000000-0000-4000-8000-000000000003' },
               content: { /* your defaults */ },
             },
             de: { /* … */ },
           },
         },
       ],
     },
   });
   ```

   The override match runs on `template.en.name` (with `template.de.name` as fallback). Any variation in any category that resolves to the same block name is removed from the catalogue and replaced by yours, including entries the merchant sees under a different heading.

3. To hide a core catalogue entry without offering a replacement, return the same category with `override: true` and an empty `variations` array. The Vue component stays available for pages that already use it, but merchants can no longer insert new instances from the catalogue.

## See also

- [Blocks discovery and overrides](/guide/editor/blocks-discovery.md) — full explanation of the mechanism
- [Blocks architecture](/guide/editor/blocks-architecture.md) — overview of the blocks system
- [Components](/guide/modules/components.md) — how to add or override generic Vue components (non block)
