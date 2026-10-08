# Publish a module to the marketplace

## Introduction

The **Publish Module** workflow (`.github/workflows/publish-module.yml`) packages a module from `packages/` and publishes it to PlentyONE's private npm registry (`shop-npm-registry.plentyone.com`), making it installable from `plentyMarketplace`.

Before anything is published, the workflow runs validation steps against your module folder. This guide walks through the files each validation expects, how to trigger the workflow, and what to fix if a validation fails.

::: info
The workflow only runs on demand (`workflow_dispatch`) — trigger it from the repository's **Actions** tab, not by pushing a commit or tag.
:::

## Prerequisites / Preparation

This guide requires that you already have created a module. If you haven't created a module yet, you can follow the [How-to create a module](/guide/modules/index.md) guide.

Your module also needs the marketplace-specific files covered below: `marketplace.json`, `meta/images/`, and `meta/documents/`. The `packages/module-four-seasons` package in this repository is a fixture built specifically to satisfy this workflow's validation — browse it for a complete, working example of the layout.

## Scenarios

### 1. Lay out the required marketplace files

```
packages/<your-module>/
├── package.json
├── marketplace.json
├── meta/
│   ├── images/
│   │   ├── icon_author_xs.png     # 32×32
│   │   ├── icon_author_sm.png     # 256×256
│   │   ├── icon_author_md.png     # 512×512
│   │   ├── icon_plugin_xs.png     # 32px wide, ≤32px tall
│   │   ├── icon_plugin_sm.png     # 256px wide, ≤256px tall
│   │   ├── icon_plugin_md.png     # 512px wide, ≤512px tall
│   │   └── preview_0.png … preview_6.png   # 1–7 files, ≤1 MB each
│   └── documents/
│       ├── support_contact_en.md / support_contact_de.md
│       ├── changelog_en.md / changelog_de.md
│       └── user_guide_en.md / user_guide_de.md
└── src/ …
```

`marketplace.json` describes the listing itself:

```json
// packages/module-four-seasons/marketplace.json
{
  "marketplaceName": { "en": "Four Seasons", "de": "Vier Jahreszeiten" },
  "price": 0.0,
  "shortDescription": {
    "en": "Adds an animated falling leaves, snow, or petal overlay to every shop page.",
    "de": "Fügt jeder Shop-Seite eine animierte Überlagerung aus fallenden Blättern, Schnee oder Blütenblättern hinzu."
  },
  "categories": ["4408"]
}
```

- `marketplaceName` and `shortDescription` must be objects keyed only by `en` and `de`, each a non-empty string.
- `price` must be a number written with a decimal point (e.g. `0.0` or `10.0`, not a plain integer). It must be either `0.0` (free) or at least `10.0` (paid) — anything between `0` and `10` is rejected.
- `categories` must be a non-empty array of category IDs.
- `keywords` is optional, but if present it must be an array.

Every file under `meta/documents/` must exist and be non-empty, and `support_contact_en.md` must contain a support email address (an `@`).

### 2. Trigger the workflow

1. Open the repository's **Actions** tab, select **Publish Module**, then **Run workflow**.
2. Fill in the inputs:
   - `module` — the path under `packages/` to your module, e.g. `module-four-seasons` or `modules/nice-modules/my-module`.
   - `dryRun` — defaults to unchecked. Check it to run `npm publish --dry-run`, which validates and builds the package without publishing it.
3. Run the workflow.

Run once with `dryRun` checked before publishing for real — it exercises every validation and the build without touching the registry.

### 3. What the workflow validates before publishing

| Step                      | Script                         | Checks                                                                 | Fails if                                                                                                                                                                                                                                                                |
| ------------------------- | ------------------------------ | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Verify module folder      | `verify-module-folder.sh`      | The `module` input resolves to an existing folder under `packages/`    | The path contains `..`, a leading slash, or characters other than letters, digits, `-`, `_`, `/`; or the folder doesn't exist                                                                                                                                           |
| Validate marketplace.json | `validate-marketplace-json.sh` | The marketplace listing fields described above                         | The file is missing or not valid JSON; `marketplaceName`/`shortDescription` aren't `{ en, de }` objects of non-empty strings; `price` isn't a valid decimal, or is between `0` and `10`; `categories` is empty or missing; `keywords` is present but not an array       |
| Validate preview images   | `validate-preview-images.sh`   | `meta/images/preview_*.png`                                            | There aren't between 1 and 7 files; any file isn't a real PNG; any file exceeds 1 MB                                                                                                                                                                                    |
| Validate meta files       | `validate-meta-files.sh`       | `package.json`, the six icon files, and the six `meta/documents` files | `package.json` or an icon is missing; an author icon isn't exactly 32×32 / 256×256 / 512×512; a plugin icon doesn't match the expected width (its height may only be equal or shorter); a `meta/documents` file is missing or empty; `support_contact_en.md` has no `@` |

Each script fails the job with the exact missing or invalid field in its output — fix that file and re-run the workflow with the same inputs.

### 4. What happens after validation passes

Once all four validations pass, the workflow:

1. Sets up Node and runs `npm run build:module`, which builds only your module via `turbo run build --filter="./packages/<module>"`.
2. Writes npm registry credentials (from the `PLENTY_MARKETPLACE_NPM_USERNAME`/`PLENTY_MARKETPLACE_NPM_PASSWORD` repository secrets) to a temporary `.npmrc`.
3. Runs `npm publish --ignore-scripts --registry https://shop-npm-registry.plentyone.com`, adding `--dry-run` if that input was checked.
4. Uploads the npm debug log as a build artifact, but only if a previous step failed.
5. Removes the temporary `.npmrc`, regardless of whether the run succeeded or failed.
