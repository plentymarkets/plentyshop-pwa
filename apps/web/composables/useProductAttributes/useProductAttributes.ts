import { UseProductAttributesState } from './types';
import { Product } from '@plentymarkets/shop-api';

const updateURLPathForVariation = (currentPath: string, itemId: string | number, variationId: string | number) => {
  const pathSegments = currentPath.split('/');
  let lastSegment = pathSegments[pathSegments.length - 1];
  const lastSegmentParts = lastSegment.split('_');

  itemId = String(itemId);
  variationId = String(variationId);

  const itemIdPosition = lastSegmentParts.length - 1;

  if (lastSegmentParts[itemIdPosition] === itemId) {
    lastSegmentParts.push(variationId);
  } else {
    lastSegmentParts[lastSegmentParts.length - 1] = variationId;
  }

  lastSegment = lastSegmentParts.join('_');
  pathSegments[pathSegments.length - 1] = lastSegment;

  return pathSegments.join('/');
};

export const useProductAttributes = () => {
  const state = useState<UseProductAttributesState>(`useProductAttributes`, () => ({
    itemId: 0,
    variationId: 0,
    attributes: [],
    attributeValues: {},
    combinations: [],
  }));

  const changeVariationId = (variationId: number) => {
    if (state.value.variationId === variationId) return;

    const route = useRoute();
    const path = updateURLPathForVariation(route.path, state.value.itemId, variationId);

    navigateTo(path);
    state.value.variationId = variationId;
  };

  const getCombination = () => {
    return state.value.combinations.find((combination) => {
      if (combination?.attributes?.length === Object.values(state.value.attributeValues).length) {
        return combination.attributes?.every((attribute) => {
          return state.value.attributeValues[attribute.attributeId] === attribute.attributeValueId;
        });
      }
      return false;
    });
  };

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

  const setAttribute = (product: Product, selectAttributes = false) => {
    state.value.itemId = product.item.id;
    state.value.variationId = product.variation.id;
    state.value.attributes = product.variationAttributeMap?.attributes || [];
    state.value.combinations = product.variationAttributeMap?.variations || [];
    state.value.attributeValues = {};

    if (selectAttributes) {
      product.attributes?.forEach((attribute) => {
        state.value.attributeValues[attribute.attributeId] = attribute.value.id;
      });
    }

    disableAttributes();
  };

  const updateValue = (attributeId: number, valueId: number | undefined) => {
    const item = state.value.attributes.find((attribute) => attribute.attributeId === attributeId);
    if (!item) return;

    const value = item.values.find((value) => value.attributeValueId === valueId);

    if (!value || !valueId) {
      delete state.value.attributeValues[attributeId];
      disableAttributes();
      return;
    }

    if (value.disabled) {
      delete state.value.attributeValues[attributeId];
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

    if (state.value.attributeValues[attributeId] === valueId) {
      delete state.value.attributeValues[attributeId];
    } else {
      state.value.attributeValues[attributeId] = valueId;
    }

    disableAttributes();
  };

  const getValue = (attributeId: number): number | undefined => {
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
