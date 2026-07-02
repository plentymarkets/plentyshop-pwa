# Blocks rendering

This article explains how blocks are rendered on the frontend in PlentyONE Shop.

The `EditableBlocks` component is the top-level container that receives the assembled block tree and iterates over it.
Each block is rendered by `PageBlock`, which resolves the correct Vue component using the dynamic block loader (`utils/blocks/blocks-imports.ts`).

## Component discovery

The loader uses `import.meta.glob()` to discover block files at build time from two source layers, loaded in a fixed order. A Nuxt module can be either internal (living in `apps/web/modules/`) or installed as an npm package under `node_modules/`.

| Layer       | Glob                                                 |
| ----------- | ---------------------------------------------------- |
| Core        | `@/components/**/blocks/**/*.vue`                    |
| Nuxt module | `~~/modules/*/runtime/components/blocks/**/*.vue`    |
| Nuxt module | `/node_modules/*/runtime/components/blocks/**/*.vue` |

Each block folder contains its `.vue` component (paired with its `Form.vue` companion), a `defaults.ts` that exports the catalogue entry (`getBlocksList`) and optionally a `createDefault` factory, and an `icon.svg` for the "Add block" catalogue.

Block components are resolved asynchronously via `defineAsyncComponent`, which enables code splitting per block.
Individual blocks can additionally implement viewport-based lazy loading (for example, `ProductRecommendedProducts` defers rendering until the block is near the viewport).

When two sources register a file with the same basename, the later source wins. This is how Nuxt modules override core blocks. See [Blocks discovery and overrides](/guide/editor/blocks-discovery.md) for the full merge semantics and the build time validation that guards against accidental overrides.

## Recursive rendering

Structure blocks render their children recursively.
For example, `HeaderContainer` renders its child blocks (utility bar, navigation) through the same `PageBlock` mechanism.

## Frozen blocks

Frozen blocks are a **navigation optimisation** that prevents visual flicker during route transitions.

When the user navigates from one blockified page to another, there is a brief moment where the new page's block data has not loaded yet but the old data is stale.
Without frozen blocks, the page would briefly flash empty or show the wrong content.

The mechanism works as follows:

1. On `onBeforeRouteUpdate`, the current `renderedBlocks` are captured into a `frozenBlocks` ref.
2. While frozen blocks exist, the template renders them instead of the (not yet loaded) fresh data.
3. When the new page's block data arrives and can be rendered, the page transitions from showing the previously frozen content to showing the fresh block tree.

This creates a seamless transition where the old content remains visible during navigation until the new content is ready to render.

## Related resources

Linked concepts

1. [Blocks architecture](/guide/editor/blocks-architecture.md) — Overview of the blocks system
2. [Blocks discovery and overrides](/guide/editor/blocks-discovery.md) — How components, catalogue entries, and icons are collected from core and Nuxt modules
3. [Structure vs. content form](/guide/editor/blocks-structure-vs-content.md) — How structure and content blocks compose
