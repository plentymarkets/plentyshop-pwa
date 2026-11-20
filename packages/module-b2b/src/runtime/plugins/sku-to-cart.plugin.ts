import { defineExtensionPlugin, useModuleRendering } from '#imports';
import extensionConfig from '../extension.config';
import { SKU_TO_CART_AREAS, SKU_TO_CART_COMPONENTS } from '../constants';

// Only runs when the extension is activated for the shop.
// The components decide on their own, based on the site setting, whether they are shown.
export default defineExtensionPlugin(extensionConfig.name, () => {
  (Object.keys(SKU_TO_CART_AREAS) as Array<keyof typeof SKU_TO_CART_AREAS>).forEach((key) => {
    useModuleRendering(SKU_TO_CART_AREAS[key]).addComponent(SKU_TO_CART_COMPONENTS[key]);
  });
});
