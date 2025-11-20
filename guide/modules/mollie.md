---
prev: false
next: false
---

# Mollie

:::info
You need to have the Mollie plugin installed in your system.
We recommend using the latest version of the Mollie plugin in order to ensure compatibility with and access to the latest features.
:::

This module is required if you want to provide Mollie payment methods to your customers.
Beginning with version **v1.14.0**, the Mollie plugin is pre-installed. Make sure that the `@plentymarkets/shop-module-mollie` package exists in your `package.json`. If you're using an earlier version or if the package is not part of your `package.json`, you can install it manually with the following command:

```bash
npm install @plentymarkets/shop-module-mollie
```

Make sure to add this module at the top of the `modules` section in your `nuxt.config.ts` file. Once installed, you only need to configure the settings in the backend.

## Settings

You can manage the Mollie settings in the backend in the **Setup** → **Orders** → **Payment** → **Mollie** menu.

## How it works

Once Mollie is enabled, the plugin is installed and Mollie has been properly configured, the Mollie payment methods will be available in the checkout process of your shop.
