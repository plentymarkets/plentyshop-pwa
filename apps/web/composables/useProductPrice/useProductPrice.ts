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
  const graduatedPrices = productGetters.getGraduatedPrices(product);

  const price = computed(() => {
    if (graduatedPrices.length) {
      return specialOffer && specialOffer < productGetters.getCheapestGraduatedPrice(product)
        ? specialOffer
        : productGetters.getCheapestGraduatedPrice(product);
    }

    const priceValue = productGetters.getPrice(product) ?? 0;
    return specialOffer && specialOffer < priceValue ? specialOffer : priceValue;
  });

  const crossedPrice = computed(() =>
    specialOffer ? productGetters.getPrice(product) : productGetters.getCrossedPrice(product),
  );

  return {
    price,
    crossedPrice,
  };
};
