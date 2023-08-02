import { ref } from 'vue';

/**
 * composable for getting product attributes data
 */
export function useProductAttribute<TAttribute extends string>(
) {
  const selectedAttrs = ref([]);

  return {
    // getAttributeList: (attributeName: TAttribute) => attributes[attributeName] || [],
    getAttributeList: () => [],
    // getAttribute: (attributeName: TAttribute) => selectedAttrs.value[attributeName],
    getAttribute: () => [],
    setAttribute: (attributeName: TAttribute, attributeValue: string) => {
      selectedAttrs.value = {
        ...selectedAttrs.value,
        [attributeName]: attributeValue,
      };
    },
  };
}
