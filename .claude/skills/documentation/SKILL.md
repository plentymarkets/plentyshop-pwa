---
name: documentation
description: 'Writing or updating Markdown documentation, README files, guides, tutorials, how-to articles, concepts, or explanations — including fixing every file that cross-references the change, not just flagging it. Use when creating new docs, editing existing docs, or structuring documentation.'
user-invocable: true
---

# Documentation Skill

Write or update Markdown docs in this repo. One run covers the doc itself plus every file that already references it. Four phases: Discovery -> Draft -> Ripple update -> Verify, with two approval checkpoints.

## Constraints

- DO NOT write or modify any source code files (`.ts`, `.vue`, `.js`, etc.)
- DO NOT guess at technical details — ask if unsure
- DO NOT write until you have enough information to produce an accurate, complete draft
- ONLY create or update files inside `docs/`, `README.md`, or `apps/*/README.md` — except the skill's own `references/lessons.md`, which is exempt (it's the skill's housekeeping, not deliverable content)

## Workflow checklist

Copy this checklist and check off steps as you go:

```
Documentation Progress:
- [ ] 1. Discovery — interview, read existing docs, classify Diataxis type, find cross-ref candidates
- [ ] Checkpoint 1 — doc brief approved
- [ ] 2. Draft — fetch template, write the doc
- [ ] 3. Ripple update — propose an edit per cross-ref candidate
- [ ] Checkpoint 2 — cross-ref edits approved
- [ ] 4. Verify — format, check paths + links, self-review style; fix and re-run until it passes
- [ ] Append references/lessons.md if a recurring issue surfaced
```

## Phase 1: Discovery

Read `references/lessons.md` first — it lists past corrections to avoid repeating.

Ask all open interview questions in one message (not one at a time):

1. **What** — the feature, concept, or workflow being documented
2. **Why** — the problem it solves / background and motivation
3. **How** — step-by-step technical or user-facing detail
4. **Who** — theme developers, module developers, or both
5. **Where** — target path (see Diataxis Framework and Placement Rules below); only ask the user to choose if two placements are equally valid
6. **Examples** — code snippets, diagrams, or screenshots to include

Read existing docs in the target area to match tone and structure.

Find cross-reference candidates:

```bash
.claude/skills/documentation/scripts/find-references.sh "<old path>" "<title>" "<slug>"
```

Fill out `assets/doc-brief-template.md` with all of the above.

-> STOP. Share the filled-in doc brief. Get explicit approval before writing anything.

## Diataxis Framework

Docs are organised by [Diataxis](https://diataxis.fr):

| Type                      | Purpose                                                           | Oriented toward | Typical location  |
| ------------------------- | ----------------------------------------------------------------- | --------------- | ----------------- |
| **Tutorial**              | Guided steps that build understanding along the way               | Learning        | `docs/guide/`     |
| **How-to guide**          | A recipe for a specific problem — reader knows what they want     | Task            | `docs/guide/`     |
| **Explanation (Concept)** | Background/context — answers "why" and "how does it work"         | Understanding   | `docs/guide/`     |
| **Reference**             | Dry, precise technical description — auto-generated or structured | Information     | `docs/reference/` |

`index.md` files are landing pages — they orient the reader and link to child pages, without being any of the four types. Every published folder needs one.

## docs/ Directory Structure

```
docs/
├── index.md                    # Root landing page (published)
├── _changelog/                 # INTERNAL — changelog entries (not published)
├── _how-to/                    # INTERNAL — unpublished how-to drafts
├── _styleguide/                # INTERNAL — writing and design style guides (not published)
├── guide/                      # Tutorials, how-to guides, and explanations
│   ├── editor/                 # Editor / CMS block architecture docs
│   ├── introduction/           # Quickstart and troubleshooting
│   ├── modules/                # Module system (extending the PWA)
│   │   ├── plentyone/          # PlentyONE-specific modules
│   │   └── shop-core/          # shop-core package modules
│   ├── product/                # Product-level features and FAQ
│   └── themes/                 # Theme and storefront customisation — apps/web/ itself
└── reference/                  # Auto-generated API/composable/SDK reference (TypeDoc)
```

A **theme** is a fork/mirror of this repo (`apps/web/`); docs in `docs/guide/themes/` target developers working inside one. A **module** extends a theme without touching its core files; docs in `docs/guide/modules/` target developers building those extensions.

Any file or folder prefixed with `_` is internal: not published, still visible in the OSS repo, used for drafts and process guides.

## Phase 2: Draft

Fetch the matching template and writing guide:

```bash
.claude/skills/documentation/scripts/fetch-templates.sh <concept|how-to|tutorial|all>
```

Use it as the structural starting point and the guide for section intent — adapt to the tone read in Phase 1, do not copy template boilerplate verbatim. Write the full document (or updated section) at the approved path and save it.

Landing pages (`index.md`) skip this fetch — there is no template for them; write a short orienting page that links to its child pages, matching sibling `index.md` files.

## Phase 3: Ripple update

For each cross-reference candidate from the doc brief, decide the specific edit (new link, updated wording, fixed path).

-> STOP. Share the candidate list with the proposed edit for each. Apply edits only after approval.

## Phase 4: Verify

Run:

```bash
.claude/skills/documentation/scripts/verify-docs.sh
```

It runs Prettier (`npm run format:fix`), fails if any changed file is outside `docs/`, `README.md`, or `apps/*/README.md`, and fails on unresolved relative Markdown links. Fix any failure and re-run until it passes — don't involve the user for a broken link or a formatting diff.

Then self-review the draft and ripple edits against Writing Conventions below; fix directly.

If the same kind of style or placement issue has now come up more than once across runs, append a short entry to `references/lessons.md`.

## Writing Conventions

- **H1** for the article title — short and descriptive
- **Opening paragraph** — one to three sentences summarising scope
- **Background section** — context and motivation (when relevant)
- **Tables** for structured comparisons and property listings
- **ASCII art or Mermaid** for data flow and architecture diagrams
- **Code blocks** with language identifiers
- Present tense, active voice
- Avoid "simply", "just", "easy" — respect the reader's time

## Placement Rules

| Situation                             | Where to put it                         |
| ------------------------------------- | --------------------------------------- |
| New concept/explanation doc           | `docs/guide/<section>/`                 |
| New how-to guide (published)          | `docs/guide/<section>/`                 |
| New tutorial                          | `docs/guide/<section>/`                 |
| New section                           | Create folder + `index.md` landing page |
| Internal process or contributor guide | Prefix file or folder with `_`          |
| Auto-generated reference              | `docs/reference/` — never edit by hand  |

Never create files under `docs/reference/` — TypeDoc generates that content.
