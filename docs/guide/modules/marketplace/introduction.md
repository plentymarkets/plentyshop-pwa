---
prev: false
next:
  text: Setup
  link: /guide/modules/marketplace/setup.md
---

# Marketplace

When a module author wants to release their module on [plentyMarketplace](https://marketplace.plentymarkets.com/),
what they release is called an **extension**. The two terms aren't interchangeable: every extension
is a module, but not every module is an extension — only the ones distributed through the
marketplace and licensed per shop.

::: tip Not releasing to the marketplace?
If your module should simply always be active once installed, none of this applies — just follow
the regular [Modules guides](/guide/modules/index.md).
:::

Being a licensed extension changes two things compared to a regular module:

- **The marketplace needs more than Nuxt module code.** On top of being a valid Nuxt module, an
  extension needs an `extension.config.ts` so the gates above have something to check, plus a
  `marketplace.json` and a `meta/` folder of icons, previews, and docs so it can actually be listed
  — see [Setup](/guide/modules/marketplace/setup.md).

- **Activation is conditional.** PlentyONE tracks which extensions are actually licensed for a
  given shop, and `@plentymarkets/shop-core` fetches that list once per server request. Your code
  needs to check it before running — see [Gates](/guide/modules/marketplace/gates.md).
