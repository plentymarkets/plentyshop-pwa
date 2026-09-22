---
name: implementing-cms-blocks
description: 'Implements a new CMS block from block-spec.md and mock.html — scaffolds it via the code-generation skill, writes the real defaults.ts/types.ts/.vue/Form.vue, writes tests, and verifies lint/typecheck/tests are green. Use when block-spec.md and mock.html already exist at the repo root and the user wants the block actually built. Second half of a two-part workflow; reads the handoff from designing-cms-blocks — run that first if these files do not exist.'
user-invocable: true
---

# Implementing CMS Blocks

Builds a working, tested CMS block from the two files `designing-cms-blocks`
produced. This skill has no memory of that interview — everything it needs is
in `block-spec.md` and `mock.html`. Read `references/block-conventions.md`
before writing any component code.

## Checklist

```
- [ ] Step 1: Read block-spec.md and mock.html
- [ ] Step 2: Scaffold via code-generation
- [ ] Step 3: Implement defaults.ts, types.ts, .vue, Form.vue
- [ ] Step 4: Write tests
- [ ] Step 5: Verify - lint, typecheck, tests
- [ ] Step 6: STOP - present results
```

## Step 1: Read the handoff

Read `<repo-root>/block-spec.md` and `<repo-root>/mock.html`. If either is
missing, stop and tell the user to run `designing-cms-blocks` first — don't
guess at the spec.

## Step 2: Scaffold

Derive flags from `block-spec.md` and run the existing `code-generation`
skill's generator:

```bash
npm run generate:block -- <BlockName> \
  --category=<spec's category> \
  --access-control=<spec's comma-separated list> \
  [--structure]       # only if spec's Type is "structure"
  [--complex-form]    # only if spec's Form complexity is "complex"
```

This is a deterministic mapping — don't add flags the spec didn't call for.

## Step 3: Implement

Read `references/block-conventions.md` first. Then, in order:

1. `defaults.ts` — real default `content` (or `configuration` for structure
   blocks) matching the spec's fields, correct `accessControl`/`category`.
2. `types.ts` — real `<Block>Content`/`<Block>Props` shape from the spec's
   field table.
3. `<Block>Form.vue` (or `forms/`+`partials/` for complex) — real editor
   fields, one `EditorFormPanel` per group, using the widget the spec
   assigned to each field.
4. `<Block>.vue` — real markup and rendering, using `mock.html`'s "Rendered
   block" section as the visual/layout reference.
5. Add a `block-layout.config.ts` override only if the spec's Layout section
   calls for one.

**If this block needs a widget or pattern not already in
`references/block-conventions.md`, implement it, then append a short section
there** — this keeps the reference current for the next block instead of
letting it drift.

## Step 4: Write tests

Write real unit tests in `__tests__/` covering the spec's fields and
behavior. Existing blocks are inconsistent here (some have none) — that is
not a precedent to follow. Prefer one spec file per concern when the block
has several independent prop groups (text/image/button/layout), matching the
`Image`/`TextCard` pattern in `references/block-conventions.md`.

## Step 5: Verify

Run, in order, and fix anything red before moving on:

```bash
npm run lint
npm run typecheck
npm run test -- --run <path to the new __tests__ files>
```

No automated visual diff against `mock.html` — that file's job ended at Step
3; don't build screenshot tooling for this.

## Step 6: STOP - present results

Show the user: the finished file list, and confirmation that lint/typecheck/
tests are green. Remind them that `block-spec.md` and `mock.html` at the repo
root are scratch handoff files — delete them before committing, they are not
part of the shipped block. The user opens the PR themselves; this skill does
not commit or push.
