# Blocks rendering

This article explains how blocks are rendered on the frontend in PlentyONE Shop.

The `EditableBlocks` component is the top-level container that receives the assembled block tree and iterates over it.
Each block is rendered by `PageBlock`, which resolves the correct Vue component using the dynamic block loader (`utils/blocks/blocks-imports.ts`).

## Component discovery

The loader uses `import.meta.glob()` to discover block components at build time from three sources:

1. Core app blocks (`@/components/blocks/`)
2. Nuxt module blocks
3. Customer package blocks (`node_modules/*/runtime/components/blocks/`)

Block components are resolved asynchronously via `defineAsyncComponent`, which enables code-splitting per block.
Individual blocks can additionally implement viewport-based lazy loading (for example, `ProductRecommendedProducts` defers rendering until the block is near the viewport).

## Recursive rendering

Structure blocks render their children recursively.
For example, `HeaderContainer` renders its child blocks (utility bar, navigation) through the same `PageBlock` mechanism.

## Related resources

Linked concepts

1. [Blocks architecture](/guide/concept/blocks-architecture.md) — Overview of the blocks system
2. [Structure vs. content form](/guide/concept/blocks-structure-vs-content.md) — How structure and content blocks compose
