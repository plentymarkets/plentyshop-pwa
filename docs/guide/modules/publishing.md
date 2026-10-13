# Publish a module to the marketplace

## Introduction

The **Publish Module** workflow (`.github/workflows/publish-module.yml`) packages a module from `packages/` and publishes it to PlentyONE's private npm registry, making it installable from [the marketplace](https://marketplace.plentyone.com/en).

Before anything is published, the workflow runs validation steps against your module folder. This guide walks through the files each validation expects, how to trigger the workflow, and what to fix if a validation fails.

## Prerequisites / Preparation

This guide requires that you already have created a module. If you haven't created a module yet, you can follow the [How-to create a module](/guide/modules/index.md) guide.

Your module also needs the marketplace-specific files covered below: `marketplace.json`, `meta/images/`, and `meta/documents/`. The `packages/module-four-seasons` package in this repository is a fixture built specifically to satisfy this workflow's validation — browse it for a complete, working example of the layout.

## Lay out the required marketplace files

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

| Field              | Required | Type             | Rules                                                                                                                                                                |
| ------------------ | -------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `marketplaceName`  | Yes      | Object           | Keyed only by `en` and `de`, each a non-empty string.                                                                                                                |
| `shortDescription` | Yes      | Object           | Keyed only by `en` and `de`, each a non-empty string.                                                                                                                |
| `price`            | Yes      | Number           | Written with a decimal point (e.g. `0.0` or `10.0`, not a plain integer). Must be `0.0` (free) or at least `10.0` (paid). Anything between `0` and `10` is rejected. |
| `categories`       | Yes      | Array of strings | Must be `["4408"]`. Other categories may become available in the future.                                                                                             |
| `subscription`     | No       | Array of objects | Offers the module as a subscription. One object per billing option, each with an `interval` and a `price`. See [Subscriptions](#subscriptions-and-free-trial).       |
| `keywords`         | No       | Array            | If present, must be an array.                                                                                                                                        |

Every file under `meta/documents/` must exist and be non-empty, and support files must contain a support email address (an `@`).

### Subscriptions and free trial

Besides a one-time purchase, you can offer your module as a subscription. Add a `subscription` array to `marketplace.json` with one entry per billing option. Remove the options you don't want to offer, for example to offer monthly billing only. Set the top-level `price` to `0.0` for the base module.

```json
{
  "price": 0.0,
  "subscription": [
    { "interval": "monthly", "price": 10.0 },
    { "interval": "quarterly", "price": 30.0 },
    { "interval": "half-yearly", "price": 60.0 },
    { "interval": "yearly", "price": 120.0 }
  ]
}
```

| Field      | Description                                                                                     |
| ---------- | ----------------------------------------------------------------------------------------------- |
| `interval` | Billing interval: `monthly`, `quarterly`, `half-yearly`, or `yearly`.                           |
| `price`    | Price per interval in euros. The PlentyONE docs state that only values above `10.00` are valid. |

A free trial gives users the full functionality of the module for 30 days, once per user. Afterwards they must buy or subscribe to keep using it.

## 2. Trigger the workflow

1. Open the repository's **Actions** tab, select **Publish Module**, then **Run workflow**.
2. Fill in the inputs:
   - `module` — the path under `packages/` to your module, e.g. `module-four-seasons` or `modules/nice-modules/my-module`.
   - `dryRun` — defaults to unchecked. Check it to run `npm publish --dry-run`, which validates and builds the package without publishing it.
3. Run the workflow.

Run once with `dryRun` checked before publishing for real — it exercises every validation and the build without touching the registry.

To check the result, open the workflow run and look at the status of each step. If a validation fails, the step's log names the missing or invalid file or field. Fix it, then re-run the workflow with the same inputs.

## 3. After publishing

Once the module is uploaded, PlentyONE reviews it before it becomes available on the marketplace.
