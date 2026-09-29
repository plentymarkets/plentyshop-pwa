import type { Product } from '@plentymarkets/shop-api';

const ITEM_TYPE_SET = 'set';

/**
 * @description Composable for detecting product sets and building set component params for cart.
 * @param product { MaybeRef<Product> }
 * @returns UseProductSet
 * @example
 * ``` ts
 * const { isSet, getCartSetComponents } = useProductSet(product);
 * ```
 */
export const useProductSet: UseProductSetReturn = (product: MaybeRef<Product>) => {
  const productRef = isRef(product) ? product : ref(product);

  const isSet = computed(() => productRef.value?.item?.itemType === ITEM_TYPE_SET);

  const getCartSetComponents: GetCartSetComponents = () => {
    if (!isSet.value) {
      return [];
    }

    const components =
      (productRef.value?.variation as unknown as { setComponents?: RawSetComponent[] })?.setComponents ?? [];

    return components.map((component) => ({
      variationId: component.defaultVariationId,
      quantity: Math.max(1, component.minimumOrderQuantity ?? 1),
    }));
  };

  return { isSet, getCartSetComponents };
};
