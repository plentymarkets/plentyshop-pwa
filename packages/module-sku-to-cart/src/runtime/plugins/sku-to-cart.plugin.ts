import { defineExtensionPlugin, useModuleRendering, useRuntimeConfig } from '#imports';
import extensionConfig from '../extension.config';
import { SKU_TO_CART_AREAS, SKU_TO_CART_COMPONENT, SKU_TO_CART_EMPTY_CART_AREA } from '../constants';
import type { SkuToCartPosition } from '../types';

// Only runs when the extension is activated for the shop.
export default defineExtensionPlugin(extensionConfig.name, () => {
  const { position } = useRuntimeConfig().public.plentymarketsSkuToCart as { position: SkuToCartPosition };
  const { addComponent } = useModuleRendering(SKU_TO_CART_AREAS[position] ?? SKU_TO_CART_AREAS.aboveCoupon);

  addComponent(SKU_TO_CART_COMPONENT);
  useModuleRendering(SKU_TO_CART_EMPTY_CART_AREA).addComponent(SKU_TO_CART_COMPONENT);
});
