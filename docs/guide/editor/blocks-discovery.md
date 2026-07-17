# Blocks discovery and overrides

This article explains how block components, their catalogue entries, and their icons are discovered in PlentyONE Shop, and how a Nuxt module can extend or override any of them.

Discovery is the mechanism by which the editor learns which blocks exist, what they look like in the "Add block" catalogue, and which Vue component renders each block. There is **no manual registration**. The shop uses [`import.meta.glob`](https://vite.dev/guide/features.html#glob-import) to collect block files from two sources on every build: the core app and Nuxt modules.

Overrides use the same mechanism. A Nuxt module places a file at the corresponding path, and the last source in the load order wins. A separate build time check makes accidental overrides fail the build when the `FAIL_BUILD_ON_UNMARKED_BLOCK_OVERRIDES` environment variable is set (CI sets it).

## Background

Historically, the block catalogue lived in a single generated file, `public/_nuxt-plenty/editor/blocksLists.json`, which the editor fetched at runtime. Every new block required both a Vue component and a hand-edited entry in that JSON file. Contributions from Nuxt modules were not possible without patching core.

The current system locates each block's catalogue entry alongside its Vue component in a `defaults.ts` file, and treats the core app and Nuxt modules as equal sources of blocks. The JSON file has been removed. Every block folder now provides all the information the shop needs to discover the block, which makes the blocks system fully modular.

## The sources

Block files are loaded from two source layers. A Nuxt module can either be an internal module that lives in `apps/web/modules/` or be installed as an npm package under `node_modules/`. Both are treated the same way.

| Layer           | Source root                                    | Where it lives                                         |
| --------------- | ---------------------------------------------- | ------------------------------------------------------ |
| **Core**        | `@/components/**/blocks/**`                    | `apps/web/app/components/blocks/`                      |
| **Nuxt module** | `~~/modules/*/runtime/components/blocks/**`    | `apps/web/modules/<module>/runtime/components/blocks/` |
| **Nuxt module** | `/node_modules/*/runtime/components/blocks/**` | `<installed package>/runtime/components/blocks/`       |

Each layer is scanned by three [`import.meta.glob`](https://vite.dev/guide/features.html#glob-import) calls, one per file type: `**/*.vue` for components, `**/defaults.ts` for catalogue entries, and `**/icon.svg` for icons.

The load order is fixed: **core → internal modules → installed modules**. When two sources register a file with the same basename, the later source wins.

## Block folder layout

Every block folder contains its component, its catalogue entry, and its icon. The block's `.vue` component and its form component belong together and always live side by side in the same folder:

```
components/
└─ blocks/
   └─ TextCard/
      ├─ TextCard.vue        # the renderable block
      ├─ TextCardForm.vue    # the form shown in the drawer
      ├─ defaults.ts         # catalogue entry + createDefault()
      ├─ icon.svg            # catalogue icon
      └─ types.ts
```

| File                              | Purpose                                                                   | Loader                                                                                                                       |
| --------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `<Name>.vue` and `<Name>Form.vue` | The renderable block and its form component                               | [`blocks-imports.ts`](https://github.com/plentymarkets/plentyshop-pwa/blob/main/apps/web/app/utils/blocks/blocks-imports.ts) |
| `defaults.ts`                     | The block's catalogue entry (`getBlocksList`) and `createDefault` factory | [`blocks-imports.ts`](https://github.com/plentymarkets/plentyshop-pwa/blob/main/apps/web/app/utils/blocks/blocks-imports.ts) |
| `icon.svg`                        | The icon shown in the "Add block" catalogue                               | [`block-icons.ts`](https://github.com/plentymarkets/plentyshop-pwa/blob/main/apps/web/app/utils/blocks/block-icons.ts)       |

Structure blocks live under a `structure/` subfolder (for example, `blocks/structure/Carousel/`). Both the component glob and the icon path parser recognise this convention.

## The `defaults.ts` module

A `defaults.ts` may export up to two named functions:

```ts
import type { BlocksList } from '~/composables/useBlocksList/types';
import type { Block } from '@plentymarkets/shop-api';

export const getBlocksList = (): BlocksList => ({
  /* … */
});

export const createDefault = (): Block => ({
  /* … */
});
```

`getBlocksList` returns one or more categories that should appear in the "Add block" catalogue. `createDefault` returns a fresh block instance.

Each entry in a `BlocksList` is a category keyed by a stable string:

| Property        | Type                       | Purpose                                                                                                          |
| --------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `title`         | `string`                   | Display title in the catalogue                                                                                   |
| `blockName`     | `string`                   | The block name displayed by the category                                                                         |
| `category`      | `string`                   | The category slug                                                                                                |
| `accessControl` | `BlocksListContext[]`      | Which page contexts (`content`, `productCategory`, `product`) may see this category                              |
| `variations`    | `BlockTemplateVariation[]` | One or more selectable variations, each with an image, title, and per language `template` block                  |
| `override`      | `boolean` (optional)       | Marks this category as an authoritative replacement, see [Catalogue level overrides](#catalogue-level-overrides) |

The `name` field of a variation's `template` block matches the basename of the `.vue` component. This is also the key the override system uses to identify blocks.

## Component level overrides

Component overrides happen on the Vue file itself. A Nuxt module places a `.vue` file at the equivalent path with the same basename as a core block:

```
apps/web/modules/my-module/runtime/components/blocks/TextCard/TextCard.vue
```

Because the loader processes core first, then internal modules, then installed modules, and each assignment overwrites the previous entry keyed by basename, the module's `TextCard.vue` replaces the core `TextCard.vue` for every place the block is rendered.

The block's catalogue entry is unaffected by this override. Existing variations still add the block into the page tree, and the module's component renders in its place.

### The `@overrides-core-block` marker

Component overrides are quietly powerful. A typo in a filename can silently replace a core block. To make the override explicit, every override file must contain the marker:

```vue
<!-- @overrides-core-block -->

<template>
  <!-- … -->
</template>
```

Enforcement is gated on the `FAIL_BUILD_ON_UNMARKED_BLOCK_OVERRIDES` environment variable. Starting the app locally always works, and local build works as long as the variable is not set. CI sets it, so pull requests with unmarked overrides fail the build check.

## Catalogue level overrides

Catalogue overrides happen on the `BlocksList` object returned by `getBlocksList`. The [`resolveBlocksList`](https://github.com/plentymarkets/plentyshop-pwa/blob/main/apps/web/app/utils/blocks/blocks-imports.ts) function walks all discovered `defaults.ts` modules in the fixed **core → internal modules → installed modules** order and merges their categories.

When a `defaults.ts` marks a category with `override: true`, three things happen:

1. Every variation in that category is looked up by its block name, using the value of `template.en.name` (with `template.de.name` as a fallback).
2. Any previously merged variation with the same block name is removed, no matter which category it lived in.
3. The new variations replace them, and the block name is remembered so that later contributions without the `override` flag skip it too.

At the end of the merge, empty categories are dropped from the result.

The consequence is that a Nuxt module can:

- **Add** new categories or variations by returning a `BlocksList` without the `override` flag.
- **Replace** the catalogue entry for a specific block by returning a category with `override: true` whose variations use the same `template.en.name`.
- **Hide** a core block from the catalogue by returning a category with `override: true` that contains no variations for the offending block name. The block still exists as a Vue component, but the catalogue no longer offers it.

Catalogue level and component level overrides are independent. Replacing a block's Vue component does not remove its catalogue entry, and marking a catalogue category `override: true` does not swap out the Vue component that renders it. Most real overrides use both together.

## Data flow

```
┌─────────────────────────────┐   ┌─────────────────────────────┐   ┌───────────────────────────┐
│  Core                       │   │  Internal Nuxt module       │   │  Installed Nuxt module    │
│  app/components/blocks/**   │   │  modules/*/runtime/blocks/  │   │  node_modules/*/runtime/  │
└──────────────┬──────────────┘   └──────────────┬──────────────┘   └──────────────┬────────────┘
               │                                 │                                 │
               ▼                                 ▼                                 ▼
       ┌──────────────────────────────────────────────────────────────────────────────────┐
       │                          import.meta.glob (build time)                           │
       │                                                                                  │
       │  .vue      →  blockLoaders map (last write wins per basename)                    │
       │  icon.svg  →  blockIcons map                                                     │
       │  defaults  →  resolveBlocksList() merges with override: true semantics           │
       └──────────────────────────────────────────────────────────────────────────────────┘
               │
               ▼
       ┌──────────────────────────────────────────┐
       │  Runtime                                 │
       │  - PageBlock resolves the Vue component  │
       │  - useBlocksList exposes the catalogue   │
       └──────────────────────────────────────────┘
```

All glob passes happen at build time. `resolveBlocksList()` runs asynchronously the first time the editor opens the "Add block" catalogue and caches its result in `useBlocksList.blocksLists`.

## Related resources

Linked concepts

1. [Blocks architecture](/guide/editor/blocks-architecture.md) — Overview of the blocks system
2. [Blocks rendering](/guide/editor/blocks-rendering.md) — How the block tree is rendered
3. [Site settings architecture](/guide/editor/site-settings-architecture.md) — The same convention applied to settings

How-to guides

1. [How to add or override a block from a module](/guide/modules/blocks.md)

External resources

1. [Vite `import.meta.glob`](https://vite.dev/guide/features.html#glob-import)
