# CMS Block Code Conventions

Seeded from surveying `MultiGrid`, `ItemData`, `Image`, `RichText`, and
`UtilityBar`. Read this before writing `defaults.ts`, `types.ts`, `<Block>.vue`,
or `<Block>Form.vue` in Step 5 of `implementing-cms-blocks`.

If a widget or pattern this block needs isn't covered below, implement it,
then append a short section here — this file is a feedback deposit box, not a
one-time snapshot.

## Contents

- Registration (what you don't need to touch)
- defaults.ts
- types.ts
- Form.vue — simple
- Form.vue — complex (multi-section)
- Main .vue rendering
- Structure blocks (children as content)
- block-layout.config.ts override
- Widget snippets
- Tests

## Registration

Blocks auto-discover via `import.meta.glob` in
`apps/web/app/utils/blocks/blocks-imports.ts` — no manual registration for a
plain content or structure block. `apps/web/app/utils/blocks/block-names.ts`
only hardcodes a handful of *immutable system* blocks (Navigation, Header,
Footer, UtilityBar) — do not add a new content block there.

## defaults.ts

Exports `getBlocksList()` returning a `category -> { category, accessControl,
title, blockName, variations[] }` map. Each variation has `en`/`de` templates
with `name`, `type` (`'content'` | `'structure'`), `meta.uuid`, and `content`
(settings object for content blocks, `Block[]` for structure blocks —
seed with real child `Block` instances, not an empty placeholder).
`accessControl` is an array of `'content' | 'productCategory' | 'product'`,
taken directly from `block-spec.md`.

## types.ts

Always define `<Block>Content` (the settings shape) and `<Block>Props`
(`name`, `type`, `content`, `meta.uuid`, `index?`). Group nested settings the
conventional way: `text`, `image`, `button`, `layout`
(`{ paddingTop, paddingBottom, paddingLeft, paddingRight, fullWidth,
backgroundColor }`). Structure blocks type `content: Block[]` plus a
`configuration` object instead (e.g. `columnWidths`, `controls`, `layout`).

## Form.vue — simple

Wrap each settings group in `EditorFormPanel` (collapsible). Read/write
reactively through `findOrDeleteBlockByUuid` — don't invent a separate state
path. One panel per group from `block-spec.md`; field order inside a panel
follows the spec's field table order.

## Form.vue — complex (multi-section)

Only when `block-spec.md` calls for it (multiple independent sections or
repeatable entities). Replace the single `Form.vue` with
`forms/<Block>SettingsForm.vue` (orchestrator) + `partials/` (per-section
list/editor/layout panels), driven by dedicated composables
(`use<Block>Configuration`, `use<Block>Form`, `use<Block>Actions`) rather than
inline logic in the form component — this is the `UtilityBar` shape.

## Main .vue rendering

Single root element; `style` computed from `content.layout` (padding,
background). Guard edit-mode-only UI (e.g. an empty-state message) behind
whatever flag the surrounding editor context exposes — don't render editor
affordances in the live storefront. Declare an `<i18n lang="json">` block with
matching `en`/`de` keys for any static copy the block itself renders (not
settings text, which comes from `content`). Responsive imagery switches via
`useViewport` breakpoints, not CSS-only `srcset` logic, to match `Image`.

## Structure blocks (children as content)

Render children via `<slot name="content">`, computing rows/columns/layout
from `configuration` (e.g. `columnWidths`) and mapping children by
`parent_slot`, matching `MultiGrid`.

## block-layout.config.ts override

Default behavior (no entry) is `defaultFullWidth: true, padding: true`. Add
an entry in `apps/web/app/configuration/block-layout.config.ts`
(`BLOCK_LAYOUT_RULES`) only when `block-spec.md`'s Layout section says the
default is wrong for this block — e.g. structure/container blocks typically
disable padding.

## Widget snippets

Pick the widget from whatever `scripts/list-components.sh` (in
`designing-cms-blocks`) surfaced for that field in `block-spec.md` — the
mapping below is how each one is conventionally wired, not a menu to pick
from freely.

| Field kind | Component | Notes |
|---|---|---|
| Short text | `SfInput` | |
| Boolean toggle | `SfSwitch` | |
| Numeric grid (e.g. padding) | native `<input type="number">` | one per side |
| Slider (e.g. brightness) | native `<input type="range">` | |
| Segmented choice (alignment/variant/fillMode) | `EditorOptionsTabs` | |
| Color | `EditorColorPicker` + `SfInput` suffix swatch | |
| Rich text | `EditorRichTextEditorForm` | |
| Image (per breakpoint) | `UiResponsiveImagePicker` | |
| Reorderable list | `vuedraggable` (`draggable`) | e.g. ItemData field order |
| Full-width toggle | `EditorFullWidthToggle` | |
| Inline help text | `SfTooltip` + `SfIconInfo` | |

## Tests

Real blocks are inconsistent here (`ItemData`/`Carousel` have none) —
`implementing-cms-blocks` does not get to follow that precedent; Step 6 of
that skill mandates real tests regardless. Where precedent exists, prefer
splitting by concern into separate spec files (Image/TextCard: one spec per
prop group — image, text, button, layout) over one large spec asserting
everything. Mock `useViewport` when testing responsive rendering.
