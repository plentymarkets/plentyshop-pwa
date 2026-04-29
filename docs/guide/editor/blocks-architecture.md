# Blocks architecture

This article explains the basics of the blocks architecture and how it works in PlentyONE Shop.
It covers the data flow, rendering pipeline, the plugin system, the distinction between global and non-global blocks, content and item categories, blockified and non-blockified pages, and the structure versus content form pattern.

Blocks are the building units of the visual storefront.
Certain pages in the shop — such as the homepage, product pages, and category pages — are composed of a tree of blocks that the editor fetches from the backend, renders on the frontend, and persists back on save.
A block is either a **structure block** (a container that holds child blocks) or a **content block** (a leaf that renders actual content such as text, images, or a product grid).

Blocks address the common pain points of rigid page layouts by giving merchants a drag-and-drop editing experience while keeping developers in control of the component catalogue.
By implementing blocks, merchants can rearrange, add, and remove page sections without modifying code.

## Background

The blocks architecture was introduced to replace static page templates with a flexible, CMS-style content system.
Historically, page layouts were hard-coded in Vue components, meaning every layout change required a code deployment.
The blocks system decouples layout from code: PlentyONE stores the block tree as structured data, and the shop dynamically renders whatever the system delivers.

## Data flow

The block data flow follows a fetch-assemble-render-save cycle.

```
PlentyONE API ──► Nuxt Plugin ──► Fetch Blocks ──► Assemble Data ──► Block Container ──► Block Rendering
                                              │                                                    │
                                              │◄──────────── Save Blocks ◄──── Editor UI ◄──────────┘
```

### Fetch phase

On every route navigation, the blocks plugin (`plugins/06.blocks.ts`) triggers a data fetch through the `useBlocks` composable.
The plugin determines the page **type** (`immutable`, `category`, `product`) and **identifier** (page-specific ID or slug) and triggers the fetch.

The response contains three top-level properties:

| Property          | Description                   |
| ----------------- | ----------------------------- |
| `blocks`          | Array of page-specific blocks |
| `HeaderContainer` | Global blocks for the header  |
| `Footer`          | Global blocks for the footer  |

### Assembly phase

A helper normalises the API response.
If any part of the response is missing, smart defaults are used:

- A missing `HeaderContainer`, `Footer`, or empty `blocks` array is replaced with a default provided by the corresponding factory (`utils/blockTemplates/`).

### State management

`useBlocks` maintains two copies of the block tree in state:

- **`data`** — the current, potentially edited block tree.
- **`cleanData`** — the last saved snapshot, marked as raw to avoid reactivity overhead.

Change detection works by deep-comparing `data` against `cleanData`.
When the two diverge, the editor shows an unsaved-changes indicator.

### Save phase

When the merchant saves, `doSaveBlocksWithGlobalBlocks()` sends the serialised block tree back to the backend.
The response is re-assembled and both `data` and `cleanData` are updated, resetting the dirty state.

For details on how blocks are rendered, see [Blocks rendering](/guide/concept/blocks-rendering.md).

For details on how block data is persisted, see [Blocks saving](/guide/concept/blocks-saving.md).

For the distinction between global and non-global blocks, see [Global blocks vs. non-global blocks](/guide/concept/blocks-global-vs-non-global.md).

## Blockified vs. non-blockified pages

Not every page in the shop uses the blocks system.

### Blockified pages

Blockified pages opt in via `definePageMeta({ isBlockified: true })`.
Currently, three page types are blockified:

| Page     | Type        | Identifier         |
| -------- | ----------- | ------------------ |
| Homepage | `immutable` | `'index'`          |
| Product  | `product`   | `0`                |
| Category | `category`  | Category ID or `0` |

For categories, the identifier depends on the category type: **content categories** use their unique category ID, while **item categories** use `0`.

These pages render the `EditableBlocks` component and participate in the full fetch-assemble-render-save cycle.

### Non-blockified pages

Pages like checkout, my account, and legal pages do not use blocks.
They are rendered with traditional Vue components and have no editor overlay.
The blocks plugin detects that these pages are not blockified and skips the data fetch.

For the distinction between structure and content blocks, see [Structure vs. content form](/guide/concept/blocks-structure-vs-content.md).

## Use cases

### Merchant customising the homepage

A merchant opens the editor on the homepage.
They see the header, a set of content blocks, and the footer.
They can rearrange the content blocks, add new ones from the block catalogue, edit block content in the side drawer, and save.
The header and footer are editable here and changes propagate to all pages.

### Developer adding a new block type

A developer creates a new block component under `components/blocks/`, registers it in `utils/blocks/blocks-imports.ts`, and optionally adds a form component with the `Form` suffix.
The block immediately appears in the editor's block catalogue for the configured page contexts.

### Content manager building a landing page

A content manager creates a content category in the backend.
Because content categories are blockified, they can use the full blocks editor to build a custom layout with text, images, grids, and product recommendations — without touching code.

## Related resources

How-to guides

1. [Site settings](/guide/how-to/editor/site-settings.md) — How to add custom settings to the editor
2. [Editor overview](/guide/how-to/editor/index.md) — Overview of all editor-related guides

Linked concepts

1. [Blocks rendering](/guide/concept/blocks-rendering.md) — How blocks are rendered on the frontend
2. [Blocks saving](/guide/concept/blocks-saving.md) — How block data is persisted
3. [Global blocks vs. non-global blocks](/guide/concept/blocks-global-vs-non-global.md) — The distinction between global and page-specific blocks
4. [Structure vs. content form](/guide/concept/blocks-structure-vs-content.md) — The two block types and how they compose
5. [Data flow](https://docs.vuestorefront.io/general/basics/data-flow) — General Alokai data flow concept
6. [Composable-centric data fetching](/guide/concept/composable-centric-data-fetching.md) — How composables manage data in plentyshop PWA
