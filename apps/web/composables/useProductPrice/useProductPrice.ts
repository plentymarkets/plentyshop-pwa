import type { Product } from '@plentymarkets/shop-api';
import { cartGetters, productGetters, productPriceGetters } from '@plentymarkets/shop-api';
/**
 * @description Composable for managing product prices.
 * @example
 * ``` ts
 * const { price, crossedPrice } = useProductPrice();
 * useProductPrice({} as Product);
 * ```
 */

export const useProductPrice = (product: Product) => {
  const { lastUpdatedCartItem } = useCart();
  const { getPropertiesPrice } = useProductOrderProperties();

  const specialOfferValue = productGetters.getSpecialOffer(product);
  const specialOffer = productPriceGetters.getSpecialOfferFormatted(product);
  const quantitySelectorValue = ref(productGetters.getMinimumOrderQuantity(product));
  const graduatedPriceByQuantity = productGetters.getGraduatedPriceByQuantity(
    product,
    cartGetters.getItemQty(lastUpdatedCartItem.value),
  )?.unitPrice.formatted;
  const graduatedPrices = productGetters.getGraduatedPrices(product);

  const priceWithPropertiesBase = specialOffer || graduatedPriceByQuantity || '0';
  const priceWithPropertiesBaseComponents = priceWithPropertiesBase.split(/\s/);
  const propertiesPriceValue = getPropertiesPrice(product);

  const calculatePropertiesPrice = () => {
    const isCurrencyBeforePrice = isNaN(Number(priceWithPropertiesBaseComponents[0]));
    const currency = isCurrencyBeforePrice
      ? priceWithPropertiesBaseComponents[0]
      : priceWithPropertiesBaseComponents[1];
    let price = isCurrencyBeforePrice ? priceWithPropertiesBaseComponents[1] : priceWithPropertiesBaseComponents[0];

    if (propertiesPriceValue) {
      price = (Number(price) + propertiesPriceValue).toFixed(2);
    }

    return isCurrencyBeforePrice ? `${currency} ${price}` : `${price} ${currency}`;
  };

  const priceWithProperties = computed(() => calculatePropertiesPrice());

  const priceWithPropertiesValue = computed(
    () =>
      (productGetters.getSpecialOffer(product) ||
        productGetters.getGraduatedPriceByQuantity(product, quantitySelectorValue.value)?.unitPrice.value ||
        0) + getPropertiesPrice(product),
  );

  const unitPriceValue = productGetters.getPrice(product) ?? 0;
  const basePriceSingleValue = computed(
    () =>
      productGetters.getGraduatedPriceByQuantity(product, quantitySelectorValue.value)?.basePrice ??
      productGetters.getDefaultBasePrice(product),
  );

  const price = computed(
    () => {
      if (graduatedPrices.length) {
        return specialOfferValue && specialOfferValue < productGetters.getCheapestGraduatedPrice(product)
        ? specialOffer
        : productPriceGetters.getPriceFormatted(product);
      }

      return specialOfferValue && specialOfferValue < unitPriceValue
      ? productPriceGetters.getSpecialOfferFormatted(product)
      : productPriceGetters.getPriceFormatted(product);
    }
  )

  const priceValue = computed(
    () => {
      if (graduatedPrices.length) {
        return specialOfferValue && specialOfferValue < productGetters.getCheapestGraduatedPrice(product)
          ? specialOfferValue
          : productPriceGetters.getCheapestGraduatedPrice(product);
      }

      return specialOfferValue && specialOfferValue < unitPriceValue
        ? specialOfferValue
        : unitPriceValue;
    }
  );

  const crossedPrice = computed(
    () => {
      return specialOfferValue ? productPriceGetters.getPriceFormatted(product) : productPriceGetters.getCrossedPriceFormatted(product);
    }
  );

  const crossedPriceValue = computed(
    () => {
      return specialOfferValue ? productPriceGetters.getPrice(product) ?? 0 : productPriceGetters.getCrossedPrice(product) ?? 0;
    }
  );

  return {
    basePriceSingleValue,
    priceWithProperties,
    priceWithPropertiesValue,
    price,
    priceValue,
    crossedPrice,
    crossedPriceValue,
  };
};
