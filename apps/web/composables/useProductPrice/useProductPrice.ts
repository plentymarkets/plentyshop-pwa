import type { Product } from '@plentymarkets/shop-api';
import { productGetters, productPriceGetters } from '@plentymarkets/shop-api';

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
      ? productPriceGetters.getSpecialOfferFormatted(product)
      : productPriceGetters.getCheapestGraduatedPriceFormatted(product),
  );
  const priceValue = computed(() =>
    specialOffer && specialOffer < productGetters.getCheapestGraduatedPrice(product)
      ? specialOffer
      : productPriceGetters.getCheapestGraduatedPrice(product),
  );

  const crossedPrice = computed(() =>
    specialOffer ? productPriceGetters.getPriceFormatted(product) : productPriceGetters.getCrossedPriceFormatted(product),
  );

  return {
    price,
    priceValue,
    crossedPrice,
  };
};
