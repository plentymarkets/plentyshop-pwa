import { computed } from 'vue';
import { useSiteSettings } from '#imports';
import { SKU_TO_CART_DEFAULT_POSITION, SKU_TO_CART_POSITIONS, SKU_TO_CART_POSITION_SETTING } from '../constants';
import type { SkuToCartPosition } from '../types';

/**
 * The position of the SKU form, as configured by the merchant in the site settings.
 * Falls back to the default for missing or unknown values.
 */
export function useSkuToCartPosition() {
  const { getSetting, updateSetting } = useSiteSettings(SKU_TO_CART_POSITION_SETTING);

  const position = computed<SkuToCartPosition>({
    get: () => {
      const value = getSetting() as SkuToCartPosition;
      return SKU_TO_CART_POSITIONS.includes(value) ? value : SKU_TO_CART_DEFAULT_POSITION;
    },
    set: (value) => updateSetting(value),
  });

  return { position };
}
