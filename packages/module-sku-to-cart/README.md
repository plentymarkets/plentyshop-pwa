# @plentymarkets/sku-to-cart

Let customers add items to the cart by entering a SKU and quantity.

## Usage

Add to `apps/web/nuxt.config.ts`:

```ts
modules: ['@plentymarkets/sku-to-cart'],
```

## Configuration

Merchants choose where the form is shown in the editor under **Settings → General → B2B Commerce → Quick Order**:
above the coupon field, below it, or not at all. The form is also shown under the "cart is empty" text, unless it is
set to "Do not show".

The default is set with the module option `position` (`'none' | 'aboveCoupon' | 'belowCoupon'`):

```ts
plentymarketsSkuToCart: { position: 'belowCoupon' },
```

Requires the shop injection areas `cart.aboveCoupon` and `cart.belowCoupon` and `@plentymarkets/shop-api` 0.191.0 or higher.

## Development

Run once after `npm install` (and again after adding composables or components) to get TypeScript support for `#imports` and auto-imports in `src/runtime/`:

```bash
npm run dev:prepare
npm run typecheck
```

## Before publishing

- Replace the placeholder images in `meta/images/` (icons and previews).
- Fill in the documents in `meta/documents/` (changelog, support contact, user guide — EN and DE).
- Publish with the **Publish Module** workflow (use `dryRun` first).
