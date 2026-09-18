---
name: designing-cms-blocks
description: 'Interviews the user to turn a vague request, a written spec, or a design mock into a structured spec and a static HTML preview for one new CMS block — covering content-vs-structure, editor category, access control, settings fields, and form complexity. Use when the user wants to design, spec, or plan a new CMS block before any code is written. First half of a two-part workflow; hands off to implementing-cms-blocks.'
user-invocable: true
---

# Designing CMS Blocks

Turns whatever the user gives you — a one-liner, a paragraph, a screenshot, a
Figma link — into two artifacts a fresh session can implement from without
asking anything else: `block-spec.md` and `mock.html`. Written to the repo
root. Do not write any component code in this skill.

## Checklist

```
- [ ] Step 1: Get the block name and whatever design input exists
- [ ] Step 2: Interview for anything undetermined
- [ ] Step 3: Write block-spec.md
- [ ] Step 4: Build mock.html
- [ ] Step 5: STOP - present both for approval
```

## Step 1: Get the input

Ask for the block name (PascalCase, e.g. `ProductRecommendations`) and
whatever exists already — this may be nothing more than a sentence. Don't ask
for a design mock if the user doesn't have one; work from what's given.

## Step 2: Interview

Fill every section of `assets/block-spec-template.md` (Step 3 uses it
directly). For each section, first try to infer the answer from what the user
already gave you; only ask about what's still open.

- **Content vs structure**: content = the block renders its own settings
  (text/image/button). Structure = the block is a container whose `content`
  is an array of *other* blocks the CMS user arranges as children (like
  `MultiGrid`/`Carousel`). Most blocks are content. Ask directly if unclear:
  "Does this block hold other blocks as children, or does it render its own
  settings?"
- **Category + access control**: category is a free-form CMS editor grouping
  (e.g. `cards`, `media`, `layout`). Access control is which editor contexts
  the block can be placed in: `content`, `productCategory`, `product` (any
  combination). Ask: "Where should this be placeable — general content pages,
  category pages, product pages?"
- **Settings fields + widgets**: run `scripts/list-components.sh` to see real,
  currently-available components from `components/editor`, `components/ui`,
  and `@storefront-ui/vue` — pick from that live list, don't invent a
  component name or rely on memory of what used to exist. Group fields the
  conventional way: `text`, `image`, `button`, `layout` (padding/fullWidth/
  backgroundColor), or a custom group if none fit.
- **Form complexity**: simple (one `<BlockName>Form.vue`) is the default.
  Only choose complex (`forms/` + `partials/`, composable-driven) when the
  block has multiple independent sections or repeatable entities to edit —
  the pattern `UtilityBar` uses. Don't default to complex for convenience.

If the user provided an image or Figma link, use it to fill in what you can
before asking — don't re-ask for things the image already answers.

## Step 3: Write block-spec.md

Fill `assets/block-spec-template.md` with the interview's answers and write
it to `<repo-root>/block-spec.md`. Leave "Open questions" as "none" unless
something genuinely can't be resolved without seeing the implementation.

## Step 4: Build mock.html

Copy `assets/mock-template.html` to `<repo-root>/mock.html` and fill in both
sections — the rendered block and its editor form — using the spec's fields.
Keep it a single static file: no build step, no framework. This is a layout
and hierarchy reference for Step 5 of `implementing-cms-blocks`, not a
pixel-perfect deliverable.

## Step 5: STOP - present for approval

Open `mock.html` and show `block-spec.md` to the user. Ask them to approve
both before any code is generated — getting content-vs-structure or access
control wrong is expensive to unwind after scaffolding. Revise and re-present
if they push back; don't proceed on an assumption.

Once approved, tell the user the next step is running `implementing-cms-blocks`
against these two files.
