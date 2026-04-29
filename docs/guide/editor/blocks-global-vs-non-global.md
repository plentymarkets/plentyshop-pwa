# Global blocks vs. non-global blocks

This article explains the distinction between global and non-global blocks in PlentyONE Shop.

The most important architectural distinction in the blocks system is between **global** and **non-global** blocks.

## Global blocks

Global blocks appear on every page of the shop.
Currently there are two global blocks:

| Block             | Type        | Role                                            |
| ----------------- | ----------- | ----------------------------------------------- |
| `HeaderContainer` | `structure` | Contains utility bar and navigation             |
| `Footer`          | `content`   | Contains footer links, legal text, and branding |

Global blocks are identified by the `isGlobalTemplate: true` flag in their `meta` object.

**Key rules for global blocks:**

- They are **only editable on the homepage** (`identifier: 'index'`, `type: 'immutable'`).
- On category and product pages they are rendered but **read-only** — the editor does not show editing controls.
- They **cannot be deleted or reordered** by the merchant.
- Changes saved on the homepage propagate to all pages.

## Non-global blocks

Non-global blocks are the regular page blocks stored in the `blocks` array.
They are specific to the page they belong to and are fully editable: merchants can add, delete, reorder, and reconfigure them.

Non-global blocks have `isGlobalTemplate: false` or the flag is absent entirely.

## Why the distinction exists

Global blocks solve the problem of cross-page consistency.
Without them, a merchant would have to edit the header and footer on every single page separately, which is error-prone and time-consuming.
By restricting editing to the homepage and propagating changes globally, the system ensures that the header and footer are always consistent across the shop.

## Related resources

Linked concepts

1. [Blocks architecture](/guide/concept/blocks-architecture.md) — Overview of the blocks system
2. [Blocks saving](/guide/concept/blocks-saving.md) — How global and page blocks are saved together
3. [Structure vs. content form](/guide/concept/blocks-structure-vs-content.md) — Block type system used by global blocks
