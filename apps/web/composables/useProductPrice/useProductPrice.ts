import type { Product } from '@plentymarkets/shop-api';
import { cartGetters, productGetters, productPriceGetters } from '@plentymarkets/shop-api';
const { lastUpdatedCartItem } = useCart();
const { getPropertiesPrice } = useProductOrderProperties();

/**
 * @description Composable for managing product prices.
 * @example
 * ``` ts
 * const { price, crossedPrice } = useProductPrice();
 * useProductPrice({} as Product);
 * ```
 */

export const useProductPrice = (product: Product) => {
  const state = useState(`productPrice-${product.variation.id}`, () => ({
    price: '',
    priceValue: 0,
    crossedPrice: '',
    crossedPriceValue: 0,
    id: product.variation.id,
  }));

  const specialOfferValue = productGetters.getSpecialOffer(product);
  const specialOffer = productPriceGetters.getSpecialOfferFormatted(product);
  const quantitySelectorValue = ref(productGetters.getMinimumOrderQuantity(product));
  const graduatedPriceByQuantity = productGetters.getGraduatedPriceByQuantity(
    product,
    cartGetters.getItemQty(lastUpdatedCartItem.value),
  )?.unitPrice.formatted;

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

  const basePriceSingleValue = computed(
    () =>
      productGetters.getGraduatedPriceByQuantity(product, quantitySelectorValue.value)?.basePrice ??
      productGetters.getDefaultBasePrice(product),
  );

  state.value.price =
    specialOfferValue && specialOfferValue < productGetters.getCheapestGraduatedPrice(product)
      ? productPriceGetters.getSpecialOfferFormatted(product)
      : productPriceGetters.getCheapestGraduatedPriceFormatted(product);

  state.value.priceValue =
    specialOfferValue && specialOfferValue < productGetters.getCheapestGraduatedPrice(product)
      ? specialOfferValue
      : productPriceGetters.getCheapestGraduatedPrice(product);

  state.value.crossedPrice = specialOfferValue
    ? productPriceGetters.getPriceFormatted(product)
    : productPriceGetters.getCrossedPriceFormatted(product);

  state.value.crossedPriceValue = specialOfferValue
    ? productPriceGetters.getPrice(product) ?? 0
    : productPriceGetters.getCrossedPrice(product) ?? 0;

  return {
    basePriceSingleValue,
    priceWithProperties,
    priceWithPropertiesValue,
    ...toRefs(state.value),
  };
};
