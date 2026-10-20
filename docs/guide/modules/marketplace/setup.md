---
prev: false
next: false
---

# Setup

A module that's licensed and distributed through plentyMarketplace needs two things beyond a
regular module: an `extension.config.ts` so its own code can gate itself (see
[Gates](/guide/modules/marketplace/gates.md)), and a `marketplace.json` plus a `meta/` folder so it
can be listed on the marketplace at all. [packages/module-four-seasons](https://github.com/plentymarkets/plentyshop-pwa/tree/main/packages/module-four-seasons) in this repository is a
working reference for all of it.

## Declare your extension config

Create `extension.config.ts` at the root of your module and declare its name with
`defineExtensionConfig`:

```ts
// my-module/extension.config.ts
import { defineExtensionConfig } from '#imports';

export default defineExtensionConfig({
  name: '@plentymarkets/four-seasons',
});
```

The `name` must exactly match your module's own package name — the `name` field in its
`package.json` (`@plentymarkets/four-seasons` in this example). That's the identifier PlentyONE
licenses the extension under and returns from the backend's extensions list, so it has to match
exactly. Every other file in your module imports this one config object rather than repeating that
string.

::: tip `meta.name` is unrelated
`defineNuxtModule({ meta: { name: ... } })` in your module's own `module.mts`/`index.ts` is Nuxt
Kit's own module-registry identity (used for dedupe, HMR, devtools) — it has no bearing on
licensing and doesn't need to match your package name. `packages/module-four-seasons/src/module.mts`
sets `meta.name: 'four-seasons'` while its `extension.config.ts` name is the full
`@plentymarkets/four-seasons`; only the latter is checked against the backend's licensed extensions.
:::

## Describe it for the marketplace listing

Add a `marketplace.json` at the root of your module:

```json
// my-module/marketplace.json
{
  "marketplaceName": { "en": "Four Seasons", "de": "Vier Jahreszeiten" },
  "price": 0.0,
  "shortDescription": {
    "en": "Adds an animated falling leaves, snow, or petal overlay to every shop page.",
    "de": "Fügt jeder Shop-Seite eine animierte Überlagerung aus fallenden Blättern, Schnee oder Blütenblättern hinzu."
  },
  "categories": ["4408"],
  "keywords": ["seasonal", "animation"]
}
```

| Field              | Required | Notes                                                                  |
| ------------------ | -------- | ---------------------------------------------------------------------- |
| `marketplaceName`  | yes      | Localized object with non-empty `en` and `de` strings, no other langs. |
| `shortDescription` | yes      | Same localized shape as `marketplaceName`.                             |
| `price`            | yes      | A float — `0.00` for free, or `10.00` and above for paid.              |
| `categories`       | yes      | Non-empty array of marketplace category IDs.                           |
| `keywords`         | no       | Array, if present.                                                     |

There's no identity field here — the module's identity for licensing still comes entirely from
`package.json`'s `name`.

## Add the required meta assets

Marketplace listings also need a `meta/` folder with icons, preview images, and documents:

```
my-module/
  meta/
    images/
      icon_author_xs.png   # 32x32
      icon_author_sm.png   # 256x256
      icon_author_md.png   # 512x512
      icon_plugin_xs.png   # 32px wide, height <= 32
      icon_plugin_sm.png   # 256px wide, height <= 256
      icon_plugin_md.png   # 512px wide, height <= 512
      preview_0.png        # 1-7 preview_<n>.png files, each a PNG under 1 MB
    documents/
      changelog_en.md
      changelog_de.md
      support_contact_en.md  # must include a support email address
      support_contact_de.md
      user_guide_en.md
      user_guide_de.md
```

The author icons must be exactly square at each fixed size; the plugin icons share the same fixed
width but may be shorter than the given height. Every document must exist and be non-empty, and the
English support contact file must contain an email address.

Both `marketplace.json` and `meta` need to be listed in your module's `package.json` `files` array
so they're included when the package is published.

## Publishing

When a module is published through `.github/workflows/publish-module.yml`, `marketplace.json`, the
preview images, and the `meta/` files are all validated before the package is built and pushed to the
registry — see the scripts under `.github/workflows/scripts/publish-module/` for the exact checks.

With the config and listing files in place, continue to [Gates](/guide/modules/marketplace/gates.md)
to gate your module's own code behind the extension config.
