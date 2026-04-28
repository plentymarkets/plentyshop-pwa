# Blocks architecture

This article explains the basics of the blocks architecture and how it works in PlentyONE Shop.
It covers the data flow, rendering pipeline, the plugin system, the distinction between global and non-global blocks, content and item categories, blockified and non-blockified pages, frozen blocks, and the structure versus content form pattern.

Blocks are the building units of the visual storefront.
Each page in the shop is composed of a tree of blocks that the editor fetches from the backend, renders on the frontend, and persists back on save.
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
Backend API ──► Plugin (06.blocks.ts) ──► useBlocks ──► assembleBlocks ──► EditableBlocks ──► PageBlock
                                              │                                                    │
                                              │◄──────────── saveBlocks ◄──── Editor UI ◄──────────┘
```

### Fetch phase

On every route navigation, the blocks plugin (`plugins/06.blocks.ts`) triggers a data fetch through the `useBlocks` composable.
The SDK method `getBlocksWithGlobalBlocks()` is called with three parameters: `identifier`, `type`, and `enableGlobalBlocks: true`.
The response contains three top-level properties:

| Property           | Description                              |
|--------------------|------------------------------------------|
| `blocks`           | Array of page-specific blocks            |
| `HeaderContainer`  | Global structure block for the header    |
| `Footer`           | Global content block for the footer      |

### Assembly phase

The `assembleBlocks` helper normalises the API response.
If any part of the response is missing, smart defaults are used:

- A missing `HeaderContainer` is replaced with a default header containing the utility bar and navigation.
- A missing `Footer` is replaced with a default footer with colour defaults.
- An empty `blocks` array is replaced with a default page template that varies by page type (homepage, category, product).

After assembly, a migration step runs to convert legacy block content formats to the current structure.

### State management

`useBlocks` maintains two copies of the block tree in state:

- **`data`** — the current, potentially edited block tree.
- **`cleanData`** — the last saved snapshot, marked as raw to avoid reactivity overhead.

Change detection works by deep-comparing `data` against `cleanData`.
When the two diverge, the editor shows an unsaved-changes indicator.

### Save phase

When the merchant saves, `doSaveBlocksWithGlobalBlocks()` sends the serialised block tree back to the backend.
The response is re-assembled and both `data` and `cleanData` are updated, resetting the dirty state.

## Plugin

The blocks plugin (`plugins/06.blocks.ts`) is the entry point of the blocks system.
It runs on every route navigation (`router.afterEach`) and is marked as `parallel: true` so it does not block other plugins.

Its responsibilities are:

1. Determine the page **type** (`immutable`, `category`, `product`) and **identifier** (page-specific ID or slug).
2. Decide whether to fetch blocks at all (item categories skip the request).
3. Set the **blocks list context** (`content`, `productCategory`, `product`, or empty) so the editor knows which block templates are available.
4. Call `useBlocks().fetchBlocks()` with the resolved identifier and type.

## Rendering

The `EditableBlocks` component is the top-level container that receives the assembled block tree and iterates over it.
Each block is rendered by `PageBlock`, which resolves the correct Vue component using the dynamic block loader (`utils/blocks/blocks-imports.ts`).

The loader uses `import.meta.glob()` to discover block components at build time from three sources:

1. Core app blocks (`@/components/blocks/`)
2. Nuxt module blocks
3. Customer package blocks (`node_modules/*/runtime/components/blocks/`)

This approach enables lazy loading: each block component is only loaded when it appears on a page.

Structure blocks render their children recursively.
For example, `HeaderContainer` renders its child blocks (utility bar, navigation) through the same `PageBlock` mechanism.

## Saving

Saving persists the current editor state to the backend.
The save payload is the full block tree serialised as a JSON string.
The SDK method `doSaveBlocksWithGlobalBlocks()` handles both page-specific blocks and global blocks (header, footer) in a single request.

After a successful save:

1. The response is re-assembled through `assembleBlocks` to normalise any backend transformations.
2. Both `data` and `cleanData` are updated from the response, resetting the dirty state.
3. The editor disables the save button until the next change.

Global blocks saved on the homepage propagate to all pages, since every page reads the same global block data.

## Global blocks vs. non-global blocks

The most important architectural distinction in the blocks system is between **global** and **non-global** blocks.

### Global blocks

Global blocks appear on every page of the shop.
Currently there are two global blocks:

| Block              | Type        | Role                                           |
|--------------------|-------------|-------------------------------------------------|
| `HeaderContainer`  | `structure` | Contains utility bar and navigation              |
| `Footer`           | `content`   | Contains footer links, legal text, and branding  |

Global blocks are identified by the `isGlobalTemplate: true` flag in their `meta` object.

**Key rules for global blocks:**

- They are **only editable on the homepage** (`identifier: 'index'`, `type: 'immutable'`).
- On category and product pages they are rendered but **read-only** — the editor does not show editing controls.
- They **cannot be deleted or reordered** by the merchant.
- Changes saved on the homepage propagate to all pages.

### Non-global blocks

Non-global blocks are the regular page blocks stored in the `blocks` array.
They are specific to the page they belong to and are fully editable: merchants can add, delete, reorder, and reconfigure them.

Non-global blocks have `isGlobalTemplate: false` or the flag is absent entirely.

## Content categories vs. item categories

The blocks system behaves differently depending on the type of category being viewed.

### Content categories

Content categories (`category.type === 'content'`) are fully blockified.
They have a unique category ID that is used as the block identifier.
Merchants can build custom layouts using the full blocks editor, making content categories ideal for landing pages, information pages, or promotional content.

### Item categories

Item categories (`category.type === 'item'`) use a fixed product grid layout.
The blocks request is **skipped entirely** for item categories (via the `prevent-blocks-request` prop on `EditableBlocks`).
The identifier is set to `0`, meaning all item categories share the same default template.

The distinction is made in the category page component:

```typescript
const identifier = computed(() =>
  productsCatalog.value?.category?.type === 'content'
    ? productsCatalog.value.category.id
    : 0
);
```

## Blockified vs. non-blockified pages

Not every page in the shop uses the blocks system.

### Blockified pages

Blockified pages opt in via `definePageMeta({ isBlockified: true })`.
Currently, three page types are blockified:

| Page     | Type        | Identifier         |
|----------|-------------|--------------------|
| Homepage | `immutable` | `'index'`          |
| Product  | `product`   | `0`                |
| Category | `category`  | Category ID or `0` |

These pages render the `EditableBlocks` component and participate in the full fetch-assemble-render-save cycle.

### Non-blockified pages

Pages like checkout, my account, and legal pages do not use blocks.
They are rendered with traditional Vue components and have no editor overlay.
The blocks plugin detects that these pages are not blockified and skips the data fetch.

## Frozen blocks

Frozen blocks are a **navigation optimisation** that prevents visual flicker during route transitions.

When the user navigates from one blockified page to another, there is a brief moment where the new page's block data has not loaded yet but the old data is stale.
Without frozen blocks, the page would briefly flash empty or show the wrong content.

The mechanism works as follows:

1. On `onBeforeRouteUpdate`, the current `renderedBlocks` are captured into a `frozenBlocks` ref.
2. While frozen blocks exist, the template renders them instead of the (not yet loaded) fresh data.
3. Once the new data arrives and is assembled, the frozen blocks are cleared and the fresh data takes over.

This creates a seamless transition where the old content remains visible until the new content is ready.

## Structure vs. content form

Every block in the system has one of two types that determine its role in the layout hierarchy.

### Structure blocks

Structure blocks are **containers**.
Their `content` property is an array of child blocks.
They define layout and composition but do not render user-facing content themselves.

Examples:

- `HeaderContainer` — wraps utility bar and navigation
- `MultiGrid` — arranges child blocks in a column layout
- `Carousel` — displays child blocks in a rotating slider

Structure blocks may carry a `configuration` object that controls layout behaviour (for example, whether the header is sticky).

### Content blocks

Content blocks are **leaves**.
Their `content` property is an object with block-specific fields (text, image URL, link target, and so on).
They render the actual visual content that the merchant sees.

Examples:

- `TextCard` — renders rich text
- `Image` — renders an image with optional caption
- `Footer` — renders footer links and branding
- `Navigation` — renders the main navigation menu

### How they compose

A page's block tree is a recursive structure where structure blocks nest other blocks (both structure and content), and content blocks form the leaves:

```
HeaderContainer (structure)
├── UtilityBar (content)
└── Navigation (content)

blocks[] (page-specific)
├── MultiGrid (structure)
│   ├── TextCard (content)
│   └── Image (content)
└── ProductRecommendedProducts (content)

Footer (content)
```

The `EditableBlocks` and `PageBlock` components traverse this tree recursively, rendering each node with its matched Vue component.

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

1. [Data flow](https://docs.vuestorefront.io/general/basics/data-flow) — General Alokai data flow concept
2. [Composable-centric data fetching](/guide/concept/composable-centric-data-fetching.md) — How composables manage data in plentyshop PWA
