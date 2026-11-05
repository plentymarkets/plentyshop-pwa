# Default page templates

This article explains where the default blocks of a page come from, and how the shop decides which template factory to run when a Nuxt module or theme overrides one.

A default page template is a factory function that returns the blocks a page starts with when nothing has been saved for it yet. The shop has five template kinds: `homepage`, `category`, `product`, `header`, and `footer`. Each kind has a core factory in `apps/web/app/utils/blockTemplates/`. A module can replace any of them by providing a file with the same name.

## Background

The editor loads a page's blocks from the PlentyONE system. A new shop, a category or product layout that was never saved, or a header that was never saved returns no data. Instead of rendering an empty page, the shop [assembles the response](/guide/editor/blocks-architecture.md) and fills the gaps with the output of a template factory.

Templates were originally hardwired to the core factories. Anyone who wanted a different starting layout had to patch core files. The shop now looks for override files first, so modules and themes can change the starting point without touching core.

## When a template applies

A template only runs when the saved data is missing or empty. It never changes a page a merchant has saved.

| Kind       | Template runs when                                                      | Can be reset in the editor |
| ---------- | ----------------------------------------------------------------------- | -------------------------- |
| `homepage` | The homepage has no saved blocks.                                       | No                         |
| `category` | The shared item category layout has no saved blocks.                    | Yes                        |
| `product`  | The shared product detail layout has no saved blocks.                   | Yes                        |
| `header`   | The saved header is missing or empty.                                   | No                         |
| `footer`   | The saved footer is missing or empty, and no legacy footer can migrate. | No                         |

Item category and product detail pages use a shared layout. The template creates that layout, and every page that uses it shows the same blocks. "Reset to default" deletes the saved layout, so it removes the merchant's customisations for all pages that share it, not for a single page. After a reset, the next load finds no data and the template runs again. For the kinds that cannot be reset, an override only affects shops that have not saved that page yet.

## Where overrides come from

The shop collects override files with [`import.meta.glob`](https://vite.dev/guide/features.html#glob-import) at build time. It scans three sources for `runtime/utils/blockTemplates/<kind>.ts`:

| Order | Source                      | Glob root                                                         |
| ----- | --------------------------- | ----------------------------------------------------------------- |
| 1     | Internal module             | `apps/web/modules/*/runtime/utils/blockTemplates/`                |
| 2     | Installed package           | `node_modules/*/runtime/utils/blockTemplates/`                    |
| 3     | Installed workspace package | `@workspace/node_modules/<package>/runtime/utils/blockTemplates/` |

The sources are merged into one map from template kind to factory. Sources are applied in the order above, so when two sources provide the same kind, the later one wins. Within one source, a file is accepted only if its name is one of the five kinds and its default export is a function. Anything else is ignored without a warning.

## How a template is resolved

Each place that needs a default calls `resolveBlockTemplate(kind, coreFactory)`. It returns the winning override for that kind, or the core factory if there is none. The result is then called to produce the blocks.

```text
page data missing or empty
        │
        ▼
resolveBlockTemplate('category', createCategory)
        │
        ├── override found ──► run the override factory (last source wins)
        │
        └── no override ─────► run the core factory
```

An override replaces the core factory completely. It is not merged with the core result. To keep part of the default, the override imports and calls the core factory itself.

## Behavior to be aware of

- **One winner per kind.** Factories are never merged. Only the last matching source is used.
- **Resolved at build time.** The globs are eager, so the set of overrides is fixed per build.
- **Silent filtering.** Files that don't match the naming or export rules are skipped without an error, so a misnamed override looks like it has no effect.

## See also

- [How to override default page templates](/guide/editor/override-default-templates.md): the step-by-step guide.
- [Blocks discovery and overrides](/guide/editor/blocks-discovery.md): the same glob-based mechanism applied to block components and catalogue entries.
- [Blocks architecture](/guide/editor/blocks-architecture.md): where default templates fit in the fetch and assemble cycle.
