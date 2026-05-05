---
prev: false
next: false
---

# Editor CMS

The editor gives merchants a drag-and-drop interface for building and maintaining storefront pages without code changes. For developers, it is a structured extension system: you define the components and settings that merchants can work with, and the editor takes care of rendering, state management, and persistence.

The editor is built around two key systems.

## Blocks

The blocks system is the visual page-building layer. Pages such as the homepage, product pages, and category pages are composed of a tree of blocks that the editor fetches from the PlentyONE system, renders in the shop, and writes back on save.

Blocks come in two kinds: [structure blocks](/guide/editor/blocks-structure-vs-content.md) are containers that define layout by nesting child blocks, while content blocks are leaves that render actual output — text, images, product grids, and so on.

The [blocks architecture](/guide/editor/blocks-architecture.md) overview explains how the fetch-assemble-render-save cycle ties all of this together. Two specific concepts are worth understanding early: [global blocks](/guide/editor/blocks-global-vs-non-global.md) (which automatically propagate to every page) versus page-specific blocks (which belong only to the page being edited). The [rendering](/guide/editor/blocks-rendering.md) and [saving](/guide/editor/blocks-saving.md) pages cover the underlying mechanics for when you need to go deeper.

## Site settings

Site settings give developers a way to expose configurable values — colours, fonts, spacing, and any other runtime parameter — through the editor's settings drawer, without merchants ever touching code or environment variables.

## Component Discovery

Both blocks and settings are discovered automatically from a [predictable folder convention](/guide/editor/site-settings-architecture.md).
This means both [Themes](/guide/themes/index.md) and [Modules](/guide/modules/index.md) can add new blocks and settings in the same way.
