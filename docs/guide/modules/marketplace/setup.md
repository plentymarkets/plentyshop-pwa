---
prev: true
next: true
---

# Setup

A module that's licensed and distributed through plentyMarketplace needs two things beyond a
regular module: an `extension.config.ts` so its own code can gate itself (see
[Gates](/guide/modules/marketplace/gates.md)), and a `marketplace.json` plus a `meta/` folder so it
can be listed on the marketplace at all. [packages/module-four-seasons](https://github.com/plentymarkets/plentyshop-pwa/tree/main/packages/module-four-seasons) in this repository is a
working reference for all of it.

## Name identifier

Your extension's name ends up written in three places: `package.json`, `extension.config.ts`, and
your module's own `meta.name`. Keep all three identical — the same scoped string, e.g.
`@plentymarkets/four-seasons` — so there's never any ambiguity about which package, config, and
registered Nuxt module belong to the same extension.

### `package.json`

```json
// my-module/package.json
{
  "name": "@plentymarkets/four-seasons"
}
```

### `extension.config.ts`

Create `extension.config.ts` inside your module's `runtime/` folder, next to its `plugins/`,
`composables/`, and `components/`, and declare the same name with `defineExtensionConfig`:

```ts
// my-module/runtime/extension.config.ts
import { defineExtensionConfig } from '#imports';

export default defineExtensionConfig({
  name: '@plentymarkets/four-seasons',
});
```

It belongs inside `runtime/` rather than at the module root because that's the only part of the
source tree that reaches the published package: `packages/module-four-seasons`'s `package.json`
only lists `dist`, `marketplace.json`, and `meta` in its `files` array, and its build step copies
`src/runtime` into `dist/runtime` — a root-level config would never ship.

This is the identifier PlentyONE licenses the extension under and returns from the backend's
extensions list, so it has to match `package.json`'s `name` exactly. Every other file in your module
imports this one config object rather than repeating the string.

### `module.mts` / `index.ts`

Your module's own Nuxt entry point also needs the same name, on `meta.name`:

```ts
// my-module/src/module.mts
import { defineNuxtModule } from '@nuxt/kit';

export default defineNuxtModule({
  meta: {
    name: '@plentymarkets/four-seasons',
  },
  // ...
});
```

## Describe it for the marketplace listing

Add a `marketplace.json` at the root of your module:

```json
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

Publishing extensions to plentyMarketplace is coming soon.
