# How to override default page templates

## Overview

This guide explains how to replace the default blocks that the shop creates for the homepage, category pages, product pages, header, and footer.

Override a default template when every new shop that installs your module or theme should start with a different layout, for example a homepage with a single hero block or a header without the utility bar. Overrides only supply the starting point. They never change pages that a merchant has already saved. For how the shop chooses between several overrides, see [Default page templates](/guide/editor/default-templates.md).

## Before you start

Before you override a template, ensure:

- You have a [Nuxt module](/guide/modules/index.md) in `apps/web/modules/` or an installed npm package to place the override in.
- You understand how the editor [assembles blocks](/guide/editor/blocks-architecture.md) and falls back to defaults when the backend returns no data.

## Overridable templates

Each template is a factory function. The override must return the same type as the core factory.

| File name     | Return type            | Used when                                                  |
| ------------- | ---------------------- | ---------------------------------------------------------- |
| `homepage.ts` | `Block[]`              | The homepage has no saved blocks.                          |
| `category.ts` | `Block[]`              | The shared item category layout has no saved blocks.       |
| `product.ts`  | `Block[]`              | The shared product detail layout has no saved blocks.      |
| `header.ts`   | `HeaderContainerBlock` | The saved header is missing or empty.                      |
| `footer.ts`   | `FooterContainerBlock` | The saved footer is missing or empty and has no legacy one |

The file name is the template kind. A file with any other name, or without a function as its default export, is ignored without a warning.

## Override a template

1. Create the file `runtime/utils/blockTemplates/<kind>.ts` inside your module, for example `apps/web/modules/my-module/runtime/utils/blockTemplates/category.ts`.

   ```text
   my-module/
   └── runtime/
       └── utils/
           └── blockTemplates/
               ├── category.ts
               └── header.ts
   ```

2. Export the factory as the **default export**. Return fresh objects on every call, and give every block a new `uuid`.

   ```ts
   import type { Block } from '@plentymarkets/shop-api';
   import { v4 as uuid } from 'uuid';

   export default (): Block[] => [
     {
       name: 'TextCard',
       type: 'content',
       meta: { uuid: uuid(), isGlobalTemplate: false },
       content: {
         text: {
           htmlDescription: '<h2>Welcome to our category</h2>',
           textAlignment: 'center',
           color: '#000',
         },
         layout: { fullWidth: false },
       },
     },
   ];
   ```

3. Start the shop. The shop finds the file at build time, so restart the dev server after adding or renaming an override file.

### Reuse a core factory

To change only part of a default, import the core factory and modify its result instead of rebuilding everything. This `header.ts` keeps the navigation and drops the utility bar:

```ts
import type { HeaderContainerBlock } from '~/components/blocks/structure/HeaderContainer/types';
import { createHeaderContainerBlock, createNavigation } from '~/utils/blockTemplates/header/factory';

export default (): HeaderContainerBlock => createHeaderContainerBlock([createNavigation()]);
```

This `footer.ts` keeps the core footer and changes a single property:

```ts
import type { FooterContainerBlock } from '~/components/blocks/structure/FooterContainer/types';
import { createFooterContainer } from '~/utils/blockTemplates/footer/factory';

export default (): FooterContainerBlock => {
  const footer = createFooterContainer();
  footer.meta = { ...footer.meta, myFlag: true } as FooterContainerBlock['meta'];
  return footer;
};
```

## Verify the override

1. Open a page that has no saved layout for the template, for example in a shop where the shared category layout has never been saved.
2. Confirm that the page shows your blocks.
3. If a layout was already saved, reset it to see your override. For category and product pages, use "Reset to default" in the editor, then reload the page. The shop builds the layout from the template again, now including your override.

::: warning
Category and product pages use a shared layout, so a reset deletes the saved layout for every page that uses it, not just the page you have open. Merchants lose their customisations for all of those pages. Don't reset on a live shop to test an override.

Only item category pages and product detail pages can be reset. The homepage, header, and footer have no reset, so once a merchant saves them, your override no longer applies to that shop.
:::

## See also

- [Default page templates](/guide/editor/default-templates.md): when a template runs and which override wins.
- [Blocks discovery and overrides](/guide/editor/blocks-discovery.md): how blocks, catalogue entries, and icons are discovered and overridden.
- [Blocks architecture](/guide/editor/blocks-architecture.md): the fetch, assemble, render, and save cycle.
- [How to create a block](/guide/editor/create-a-block.md): add blocks that your templates can use.
