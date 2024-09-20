import type { Product } from '@plentymarkets/shop-api';
import { productGetters } from '@plentymarkets/shop-api';

/**
 * @description Composable for managing product prices.
 * @example
 * ``` ts
 * const { price, crossedPrice } = useProductPrice();
 * useProductPrice({} as Product);
 * ```
 */

export const useProductPrice = (product: Product) => {
  const specialOffer = productGetters.getSpecialOffer(product);

  const price = computed(() =>
    specialOffer && specialOffer < productGetters.getCheapestGraduatedPrice(product)
      ? specialOffer
      : productGetters.getCheapestGraduatedPrice(product),
  );

  const crossedPrice = computed(() =>
    specialOffer ? productGetters.getPrice(product) : productGetters.getCrossedPrice(product),
  );

  return {
    price,
    crossedPrice,
  };
};
