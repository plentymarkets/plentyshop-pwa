import type { Product } from '@plentymarkets/shop-api';
import { productGetters } from '@plentymarkets/shop-api';

/**
 * @description Composable for getting an array of `ActiveShippingCountry`.
 * @example
 * ``` ts
 * const {
 *  data,
 *  loading,
 *  getActiveShippingCountries
 * } = useActiveShippingCountries();
 * getActiveShippingCountries();
 * ```
 */

export const useProductPrice = (product: Product) => {
  const specialOffer = productGetters.getSpecialOffer(product);

  const price = computed(() =>
    specialOffer && specialOffer < productGetters.getCheapestGraduatedPrice(product)
      ? specialOffer
      : productGetters.getCheapestGraduatedPrice(product),
  );

  const crossedPrice = computed(
    () => (specialOffer ? productGetters.getPrice(product) : productGetters.getCrossedPrice(product)) || undefined,
  );

  return {
    price,
    crossedPrice,
  };
};
