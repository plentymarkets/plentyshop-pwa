# @plentymarkets/b2b

B2B features for the shop. Each feature has its own settings in the editor under **Settings → General → B2B Commerce**.

## Features

- **SKU to cart** — customers add items to the cart by entering a SKU and quantity.

## Usage

Add to `apps/web/nuxt.config.ts`:

```ts
modules: ['@plentymarkets/b2b'],
```

## SKU to cart

Merchants choose where the form is shown in the editor under **Settings → General → B2B Commerce → Quick Order**:
above the coupon field, below it, or not at all. The form is also shown under the "cart is empty" text (without the collapsible),
unless it is set to "Do not show".

The default is set with the module option `skuToCart.position` (`'none' | 'aboveCoupon' | 'belowCoupon'`):

```ts
plentymarketsB2b: { skuToCart: { position: 'belowCoupon' } },
```

Requires the shop injection areas `cart.aboveCoupon` and `cart.belowCoupon` and `@plentymarkets/shop-api` 0.191.0 or higher.

## Development

Run once after `npm install` (and again after adding composables or components) to get TypeScript support for `#imports` and auto-imports in `src/runtime/`:

```bash
npm run dev:prepare
npm run typecheck
```

## Before publishing

- Fill in the documents in `meta/documents/` (changelog, support contact, user guide — EN and DE).
- Publish with the **Publish Module** workflow (use `dryRun` first).
