# Structure vs. content form

This article explains the two block types in PlentyONE Shop and how they compose into a page layout.

Every block in the system has one of two types that determine its role in the layout hierarchy.

## Structure blocks

Structure blocks are **containers**.
Their `content` property is an array of child blocks.
They define layout and composition but do not render user-facing content themselves.

Examples:

- `HeaderContainer` — wraps utility bar and navigation
- `MultiGrid` — arranges child blocks in a column layout
- `Carousel` — displays child blocks in a rotating slider

Structure blocks may carry a `configuration` object that controls layout behaviour (for example, whether the header is sticky).

## Content blocks

Content blocks are **leaves**.
Their `content` property is an object with block-specific fields (text, image URL, link target, and so on).
They render the actual visual content that the merchant sees.

Examples:

- `TextCard` — renders rich text
- `Image` — renders an image with optional caption
- `Footer` — renders footer links and branding
- `Navigation` — renders the main navigation menu

## How they compose

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

## Related resources

Linked concepts

1. [Blocks architecture](/guide/concept/blocks-architecture.md) — Overview of the blocks system
2. [Blocks rendering](/guide/concept/blocks-rendering.md) — How the recursive rendering works
