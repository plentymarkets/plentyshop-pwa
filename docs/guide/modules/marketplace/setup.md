---
prev: true
next: true
---

# Setup

This guide explains how to prepare a module for distribution through plentyMarketplace.
A module that's published and distributed this way is called an **extension** (see [Introduction](/guide/modules/marketplace/introduction.md)), and needs two things beyond a regular module: an `extension.config.ts` so its own code can gate itself (see [Gates](/guide/modules/marketplace/gates.md)), and a `marketplace.json` plus a `meta/` folder so it can be listed on the marketplace at all.
[packages/module-four-seasons](https://github.com/plentymarkets/plentyshop-pwa/tree/main/packages/module-four-seasons)
is a working reference for all of it.

## Before you start

Before you set up an extension, ensure you have:

- A working Nuxt module, built following the regular [Modules guides](/guide/modules/index.md).
- A `package.json` at the root of that module.

## Keep the name identifier consistent

Your extension's name ends up written in three places: `package.json`, `extension.config.ts`, and your module's own `meta.name`.
Keep all three identical — the same scoped string, e.g. `@plentymarkets/four-seasons` — so there's never any ambiguity about which package, config, and registered Nuxt module belong to the same extension.

1. Declare the name in `package.json`:

   ```json
   // my-module/package.json
   {
     "name": "@plentymarkets/four-seasons"
   }
   ```

2. Create `extension.config.ts` inside your module's `runtime/` folder, next to its `plugins/`, `composables/`, and `components/`, and declare the same name with `defineExtensionConfig`:

   ```ts
   // my-module/runtime/extension.config.ts
   import { defineExtensionConfig } from '#imports';

   export default defineExtensionConfig({
     name: '@plentymarkets/four-seasons',
   });
   ```

   This is the identifier PlentyONE licenses the extension under and returns from the backend's extensions list, so it has to match `package.json`'s `name` exactly.
   Every other file in your module imports this one config object rather than repeating the string.

3. Give your module's own Nuxt entry point the same name, on `meta.name`:

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

## Describe the extension for the marketplace listing

1. Add a `marketplace.json` at the root of your module:

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

   | Field              | Required | Notes                                                                                                                                   |
   | ------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------- |
   | `marketplaceName`  | yes      | Localized object with non-empty `en` and `de` strings, no other langs.                                                                  |
   | `shortDescription` | yes      | Same localized shape as `marketplaceName`.                                                                                              |
   | `price`            | yes      | A float written with a decimal point (`0.0`, not `0`). Must be `0.0` (free) or at least `10.0` (paid). Anything in between is rejected. |
   | `categories`       | yes      | Must be `["4408"]`. Other categories may become available in the future.                                                                |
   | `subscription`     | no       | Array of objects, one per billing option. See [Offer a subscription](#offer-a-subscription).                                            |
   | `keywords`         | no       | Array, if present.                                                                                                                      |

   There's no identity field here — the module's identity for licensing still comes entirely from `package.json`'s `name`.

## Add the required meta assets

1. Create a `meta/` folder with icons, preview images, and documents:

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

   The author icons must be exactly square at each fixed size; the plugin icons share the same fixed width but may be shorter than the given height.
   Every document must exist and be non-empty, and the English support contact file must contain an email address.

2. List both `marketplace.json` and `meta` in your module's `package.json` `files` array so they're included when the package is published.

## Offer a subscription

Besides a one-time purchase, you can offer your extension as a subscription. Add a `subscription` array to `marketplace.json` with one entry per billing option, and remove the options you don't want to offer (for example, to offer monthly billing only). Set the top-level `price` to `0.0` for the base extension.

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

A free trial gives users the full functionality of the extension for 30 days, once per user. Afterwards they must buy or subscribe to keep using it.

## Next step

Once the files are in place, [publish the extension](/guide/modules/marketplace/publishing.md).

## See also

- [Introduction](/guide/modules/marketplace/introduction.md) — what an extension is and when this setup applies.
- [Publishing](/guide/modules/marketplace/publishing.md) — validate and publish the extension to the marketplace.
- [Gates](/guide/modules/marketplace/gates.md) — gate your code with the `extension.config.ts` you just created.
- [packages/module-four-seasons](https://github.com/plentymarkets/plentyshop-pwa/tree/main/packages/module-four-seasons) — a working reference implementation.
