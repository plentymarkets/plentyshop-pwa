import type {
  GetCombination,
  GetValue,
  SetAttribute,
  UpdateValue,
  UseProductAttributesReturn,
  UseProductAttributesState,
} from './types';
import type { Product, VariationMapProductVariation } from '@plentymarkets/shop-api';

/**
 * @description Composable for handling product attributes.
 * @returns UseProductAttributesReturn
 * @example
 * ``` ts
 * const {
 *  setAttribute, updateValue, attributes, getCombination, itemId, variationId, attributesValues, combinations
 * } = useProductAttributes();
 * ```
 */
export const useProductAttributes = (): UseProductAttributesReturn => {
  const state = useState<UseProductAttributesState>(`useProductAttributes`, () => ({
    attributes: [],
    attributeValues: {},
    combinations: [],
    itemId: 0,
    variationId: 0,
  }));

  /**
   * @description Function for redirecting to the product variation.
   * @example
   * ``` ts
   * changeVariationId(1072);
   * ```
   */
  const changeVariationId = (variationId: number): void => {
    if (state.value.variationId === variationId) return;

    const route = useRoute();
    const path = updateProductURLPathForVariation(route.path, state.value.itemId, variationId);

    navigateTo(path);
    state.value.variationId = variationId;
  };

  /**
   * @description Function for getting a valid combination from selected attributes.
   * @returns VariationMapProductVariation | null
   * @example
   * ``` ts
   * getCombination();
   * ```
   */
  const getCombination: GetCombination = (): VariationMapProductVariation | null => {
    return (
      state.value.combinations.find((combination) => {
        if (combination?.attributes?.length === Object.values(state.value.attributeValues).length) {
          return combination.attributes?.every((attribute) => {
            return state.value.attributeValues[attribute.attributeId] === attribute.attributeValueId;
          });
        }
        return false;
      }) ?? null
    );
  };

  /**
   * @description Function disabling attributes based on possible combinations.
   * @example
   * ``` ts
   * disableAttributes();
   * ```
   */
  const disableAttributes = () => {
    state.value.attributes.forEach((attribute) => {
      attribute.values.forEach((value) => {
        const attributeValues = { ...state.value.attributeValues, [attribute.attributeId]: value.attributeValueId };
        value.disabled = !state.value.combinations?.some((combination) => {
          return Object.entries(attributeValues).every(([attributeId, valueId]) => {
            return combination.attributes?.some((attribute) => {
              return attribute.attributeId === Number(attributeId) && attribute.attributeValueId === valueId;
            });
          });
        });
      });
    });

    const combination = getCombination();

    if (combination) {
      const id = Number(combination.variationId);
      changeVariationId(id);
    }
  };

  /**
   * @description Function for set up the product attributes and preselect them if needed.
   * @example
   * ``` ts
   * setAttribute(product, true);
   * ```
   */
  const setAttribute: SetAttribute = (product: Product, preSelectAttributes = false) => {
    state.value.itemId = product.item.id;
    state.value.variationId = product.variation.id;
    state.value.attributes = product.variationAttributeMap?.attributes || [];
    state.value.combinations = product.variationAttributeMap?.variations || [];
    state.value.attributeValues = {};

    if (preSelectAttributes) {
      product.attributes?.forEach((attribute) => {
        state.value.attributeValues[attribute.attributeId] = attribute.value.id;
      });
    }

    disableAttributes();
  };

  /**
   * @description Function for updating the value of an attribute.
   * @example
   * ``` ts
   * updateValue(1, 3);
   * ```
   */
  const updateValue: UpdateValue = (attributeId: number, valueId: number | undefined) => {
    const item = state.value.attributes.find((attribute) => attribute.attributeId === attributeId);
    const value = item?.values.find((value) => value.attributeValueId === valueId) || undefined;

    if (!value || !valueId) {
      delete state.value.attributeValues.attributeId;
      disableAttributes();
      return;
    }

    if (value.disabled) {
      delete state.value.attributeValues.attributeId;
      const oldValues = { ...state.value.attributeValues };
      state.value.attributeValues = {};
      state.value.attributeValues[attributeId] = valueId;
      disableAttributes();

      Object.values(oldValues).forEach((oldValueId) => {
        const oldKey = Object.keys(oldValues).find((key) => oldValues[key] === oldValueId);
        const oldValue = state.value.attributes
          .find((attribute) => attribute.attributeId === Number(oldKey ?? 0))
          ?.values.find((value) => value.attributeValueId === oldValueId);

        if (oldKey && oldValue && !oldValue.disabled) {
          state.value.attributeValues[oldKey] = oldValueId;
          disableAttributes();
        }
      });
      return;
    }

    if (state.value.attributeValues[attributeId] !== valueId) {
      state.value.attributeValues[attributeId] = valueId;
    }

    disableAttributes();
  };

  /**
   * @description Function for getting the value of an attribute.
   * @returns number | undefined
   * @example
   * ``` ts
   * getValue(1);
   * ```
   */
  const getValue: GetValue = (attributeId: number): number | undefined => {
    return state.value.attributeValues[attributeId] || undefined;
  };

  return {
    ...toRefs(state.value),
    setAttribute,
    updateValue,
    getValue,
    getCombination,
  };
};
