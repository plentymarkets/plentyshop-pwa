---
name: documentation
description: 'Writing or updating Markdown documentation, README files, guides, tutorials, how-to articles, concepts, or explanations. Use when creating new docs, editing existing docs, or structuring documentation.'
user-invocable: true
---

# Documentation Skill

Use this skill whenever you are writing or updating any Markdown documentation in this project. Conduct an interview to gather the necessary information before writing.

## Constraints

- DO NOT write or modify any source code files (`.ts`, `.vue`, `.js`, etc.)
- DO NOT guess at technical details — ask if unsure
- DO NOT write until you have enough information to produce an accurate, complete draft
- ONLY create or update files inside `docs/`, `README.md`, or `apps/*/README.md`

## Approach

1. Read any existing docs in the target area first to match tone and structure.
2. Ask interview questions to gather missing information (see Interview Approach below).
3. Determine the Diataxis type (tutorial, how-to, explanation, or reference) and propose the target file path per the Placement Rules. Only ask the user to choose if two equally valid locations exist.
4. Fetch the matching template and writing guide (see Fetching Templates) and use it as the structural starting point, adapted to match existing `docs/` style.
5. Write the full document (or the updated section) and save it.
6. Identify related files that contain cross-references or links that should be updated. List them and ask the user for confirmation before editing any of them.

## Interview Approach

Before writing, conduct a focused interview. Cover these areas:

1. **What** — What is the feature, concept, or workflow being documented?
2. **Why** — What problem does it solve? What is the background/motivation?
3. **How** — Step-by-step: how does it work technically or from a user perspective?
4. **Who** — Is this for theme developers, module developers, or both?
5. **Where** — Search `docs/` to find the best existing file or section (see Diataxis Framework and Placement Rules below). Propose a specific path and only ask the user to confirm if you are genuinely uncertain between two candidates.
6. **Examples** — Are there code snippets, diagrams, or screenshots to include?

Ask all questions that are still open in one message. Do not ask one question at a time.

## Diataxis Framework

This project organises documentation according to [Diataxis](https://diataxis.fr), a four-quadrant model:

| Type                      | Purpose                                                                                                               | Oriented toward | Typical location  |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------- | ----------------- |
| **Tutorial**              | A guided learning experience — the reader follows steps to accomplish something and build understanding along the way | Learning        | `docs/guide/`     |
| **How-to guide**          | A recipe for solving a specific real-world problem — assumes the reader knows what they want                          | Task            | `docs/guide/`     |
| **Explanation (Concept)** | Background, context, and understanding — answers "why" and "how does it work"                                         | Understanding   | `docs/guide/`     |
| **Reference**             | Dry, precise technical descriptions of the system — auto-generated or highly structured                               | Information     | `docs/reference/` |

**Landing pages** (`index.md`) introduce a section without being any of the four types. They orient the reader and link to child pages. Every folder that is published should have an `index.md`.

When unsure which type a document is, ask yourself: is the reader trying to _learn_, _do_, _understand_, or _look something up_?

## docs/ Directory Structure

```
docs/
├── index.md                    # Root landing page (published)
├── _changelog/                 # INTERNAL — changelog entries (not published)
├── _how-to/            # INTERNAL — unpublished how-to drafts
├── _styleguide/                # INTERNAL — writing and design style guides (not published)
├── guide/                      # Tutorials, how-to guides, and explanations
│   ├── editor/                 # Editor / CMS block architecture docs
│   │   └── index.md            # Landing page for the editor section
│   ├── introduction/           # Quickstart and troubleshooting
│   ├── modules/                # Module system (extending the PWA)
│   │   ├── index.md
│   │   ├── plentyone/          # PlentyONE-specific modules
│   │   └── shop-core/          # shop-core package modules
│   ├── product/                # Product-level features and FAQ
│   │   └── index.md
│   └── themes/                 # Theme and storefront customisation
│       │                       # A theme is a fork or mirror of this repo; it IS apps/web/
│       └── index.md
└── reference/                  # Auto-generated API/composable/SDK reference (TypeDoc)
    ├── api/
    ├── composables/
    └── sdk/
```

### Theme vs. module

A **theme** is a fork or mirror of this repository. It is `apps/web/` — the full Nuxt application (pages, components, composables, layouts, middleware, etc.). Merchants or agencies maintain their own copy and track upstream changes via Git. Documentation in `docs/guide/themes/` is aimed at developers working inside a theme.

A **module** extends a theme without modifying its core files. Documentation in `docs/guide/modules/` is aimed at developers building reusable extensions.

### Underscore prefix convention

Any file or directory whose name begins with `_` is **internal**. Internal items:

- Are **not published** to the public documentation site
- **Are visible** in the open-source GitHub repository
- Are used for drafts, internal guides, changelogs, and style references

When creating a new file that should not be published (e.g. a draft or a process guide for contributors), prefix its name or folder with `_`.

## Writing Conventions

Follow the established style in `docs/`:

- **H1** for the article title — short and descriptive
- **Opening paragraph** — one to three sentences summarising the article's scope
- **Background section** — context and motivation (when relevant)
- Use **tables** for structured comparisons and property listings
- Use **ASCII art or Mermaid** for data flow and architecture diagrams
- Use **code blocks** with language identifiers
- Write in present tense, active voice
- Avoid "simply", "just", "easy" — respect the reader's time

## Fetching Templates

Before writing a new document, fetch the appropriate template and writing guide from The Good Docs Project:

```bash
# Fetch template + guide for a specific type
.claude/skills/documentation/scripts/fetch-templates.sh concept
.claude/skills/documentation/scripts/fetch-templates.sh how-to
.claude/skills/documentation/scripts/fetch-templates.sh tutorial

# Fetch all at once
.claude/skills/documentation/scripts/fetch-templates.sh all
```

Use the fetched template as the structural starting point and the guide to understand the intent and tone of each section. Adapt the template to match the style of existing docs in `docs/` — do not copy template boilerplate verbatim.

## Placement Rules

| Situation                             | Where to put it                          |
| ------------------------------------- | ---------------------------------------- |
| New concept/explanation doc           | `docs/guide/<section>/`                  |
| New how-to guide (published)          | `docs/guide/<section>/`                  |
| New tutorial                          | `docs/guide/<section>/`                  |
| New section                           | Create folder + `index.md` landing page  |
| Internal process or contributor guide | Prefix file or folder with `_`           |
| Auto-generated reference              | `docs/reference/` — do not edit manually |

Never create files under `docs/reference/` — that content is generated by TypeDoc.

## Output Format

A saved Markdown file at the proposed path. After saving, output a one-paragraph summary of what was documented, then list any related files that contain cross-references or should link to the new content — and ask the user whether to update each one.
