import { defineShopCoreConfig } from "@plentymarkets/shop-core";

export default defineShopCoreConfig({
  renderingAreas: [
    'checkout.afterBuyButton',
    'cart.empty'
  ] as const,
});
