<template>
  <pre></pre>
  <SfSelect
    v-for="(attribute, index) in transformedProduct.attributes"
    :key="index"
    class="mb-2"
    @update:model-value="changeVariationId($event, index)"
    v-model="selectedVariations[index]"
    size="sm"
    placeholder="Select"
  >
    <option
      v-for="value in attribute.values"
      :key="value.attributeValueId"
      :value="value.attributeValueId"
      :disabled="value.disabled"
    >
      {{ value.name }}
    </option>
  </SfSelect>
  <button @click="resetAttributes">RESET</button>
</template>

<script setup lang="ts">
import { SfSelect } from '@storefront-ui/vue';
import { AttributeSelectProps } from '~/components/AttributeSelect/types';

const props = defineProps<AttributeSelectProps>();
const product = props.product;

const transformProductData = (product: any) => {
  const { attributes, variations } = product.variationAttributeMap;

  const transformedAttributes = attributes.map(({ attributeId, name, values }) => ({
    attributeId,
    name,
    values: values.map(({ attributeValueId, name }) => ({
      attributeValueId,
      name,
      disabled: false, // Assuming all values are initially available
    })),
  }));

  const transformedCombinations = variations.map(({ variationId, isSalable, attributes }) => ({
    variationId,
    isSalable,
    attributeCombination: attributes,
  }));

  return {
    attributes: transformedAttributes,
    combinations: transformedCombinations,
  };
};

const transformedProduct = computed(() => transformProductData(product));

let selectedVariations = ref(Array.from({ length: transformedProduct.value.attributes.length }).fill(null));

const changeVariationId = (selectedValue, index) => {
  selectedVariations.value[index] = Number.parseInt(selectedValue);

  if (selectedVariations.value.every((value) => value !== null)) {
    // Check if all attributes are selected
    for (const combination of transformedProduct.value.combinations) {
      const match = combination.attributeCombination.every(
        (attribute, index_) =>
          selectedVariations.value[index_] === null || attribute.attributeValueId === selectedVariations.value[index_],
      );

      if (match && combination.isSalable) {
        console.log(combination.variationId);
        // If you want to obtain the variationId, you can use combination.variationId here.
        // For instance, you can emit this value to the parent or store it in a ref variable.
        break;
      }
    }
  }

  updateAvailableOptions();
};

const updateAvailableOptions = () => {
  for (const attribute of transformedProduct.value.attributes) {
    for (const value of attribute.values) {
      value.disabled = !isOptionAvailable(attribute.attributeId, value.attributeValueId, selectedVariations.value);
    }
  }
};

const isOptionAvailable = (attributeId, valueId, currentSelections) => {
  // Iterate through each product combination
  for (const combination of transformedProduct.value.combinations) {
    if (!combination.isSalable) {
      continue; // Skip if this combination is not salable
    }

    const attributeInCombination = combination.attributeCombination.find(
      (attribute) => attribute.attributeId === attributeId,
    );

    // If the combination doesn't have the attribute or the value, skip
    if (!attributeInCombination || attributeInCombination.attributeValueId !== valueId) {
      continue;
    }

    const isValidCombination = currentSelections.every((selectedValue, index) => {
      // If the selection is null, then it is considered valid since it hasn't been chosen yet
      if (selectedValue === null) return true;

      // If the current attribute value is part of the combination, it is valid
      const attributeInCurrentCombination = combination.attributeCombination[index];
      return attributeInCurrentCombination.attributeValueId === selectedValue;
    });

    if (isValidCombination) {
      return true; // Found a valid combination with the attribute value
    }
  }

  return false; // No valid combinations found for this attribute value
};

const resetAttributes = () => {
  selectedVariations.value = Array.from({ length: transformedProduct.value.attributes.length }).fill(null);
  updateAvailableOptions(); // Update available options after resetting
};

// Initialize available options
watchEffect(() => {
  updateAvailableOptions();
});
</script>
