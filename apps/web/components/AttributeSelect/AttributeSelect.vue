<template>
  <div>
    <div v-for="(attribute, index) in transformedProduct.attributes" :key="index">
      <label :for="'attribute-' + attribute.attributeId" class="capitalize text-xs text-neutral-500">
        {{ attribute.name }}
      </label>
      <SfSelect
        :id="'attribute-' + attribute.attributeId"
        class="mb-2"
        @update:model-value="changeVariationId($event, index)"
        v-model="selectedVariations[index]"
        size="sm"
        placeholder="Please Select"
      >
        <option :value="null">Please Select</option>
        <option
          v-for="value in attribute.values"
          :key="value.attributeValueId"
          :value="value.attributeValueId"
          :disabled="value.disabled"
        >
          {{ value.name }}
        </option>
      </SfSelect>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { SfSelect } from '@storefront-ui/vue';
import { AttributeSelectProps } from '~/components/AttributeSelect/types';

const props = defineProps<AttributeSelectProps>();
const product = props.product ?? { variationAttributeMap: { attributes: [], variations: [] } };

const router = useRouter();
const route = useRoute();

const transformProductData = (product: any) => {
  const { attributes, variations } = product.variationAttributeMap;

  return {
    attributes: attributes.map(({ attributeId, name, values }) => ({
      attributeId,
      name,
      values: values.map(({ attributeValueId, name }) => ({
        attributeValueId,
        name,
        disabled: false,
      })),
    })),
    combinations: variations.map(({ variationId, isSalable, attributes }) => ({
      variationId,
      isSalable,
      attributeCombination: attributes,
    })),
  };
};

const transformedProduct = reactive(transformProductData(product));

const currentVariationId = computed(() => {
  const parts = route.params.slug?.toString().split('-');
  return parts?.length ? Number(parts[parts.length - 1]) : null;

});

const setInitialSelectedVariations = () => {
  if (currentVariationId.value) {
    const currentCombination = transformedProduct.combinations.find(
      (combo) => combo.variationId === currentVariationId.value,
    );
    if (currentCombination) {
      return transformedProduct.attributes.map((attribute) => {
        const attInCombination = currentCombination.attributeCombination.find(
          (att) => att.attributeId === attribute.attributeId,
        );
        return attInCombination ? attInCombination.attributeValueId : null;
      });
    }
  }
  return Array.from({ length: transformedProduct.attributes.length }).fill(null);
};

let selectedVariations = ref(setInitialSelectedVariations());

const resetDisabledStatus = () => {
  for (const attribute of transformedProduct.attributes) {
    for (const value of attribute.values) {
      value.disabled = false;
    }
  }
};

const isOptionAvailableForCurrentSelection = (attributeId, valueId, temporarySelectedVariations) => {
  return transformedProduct.combinations.some((combination) => {
    if (!combination.isSalable) return false;

    const matchesSelected = combination.attributeCombination.every((attribute, index) => {
      return (
        temporarySelectedVariations[index] === null || temporarySelectedVariations[index] === attribute.attributeValueId
      );
    });

    if (!matchesSelected) return false;

    const attributeInCombination = combination.attributeCombination.find(
      (attribute) => attribute.attributeId === attributeId,
    );
    return attributeInCombination && attributeInCombination.attributeValueId === valueId;
  });
};

const updateAvailableOptions = () => {
  for (const [index, attribute] of transformedProduct.attributes.entries()) {
    for (const value of attribute.values) {
      const temporarySelectedVariations = [...selectedVariations.value];
      temporarySelectedVariations[index] = value.attributeValueId;
      value.disabled = !isOptionAvailableForCurrentSelection(
        attribute.attributeId,
        value.attributeValueId,
        temporarySelectedVariations,
      );
    }
  }
};

const getSelectedVariationId = () => {
  const matchingCombination = transformedProduct.combinations.find((combination) => {
    if (!combination.isSalable) return false;

    return combination.attributeCombination.every((attribute, index) => {
      return selectedVariations.value[index] === attribute.attributeValueId;
    });
  });

  return matchingCombination ? matchingCombination.variationId : null;
};

const changeVariationId = (selectedValue, index) => {
  if (selectedValue === null) {
    selectedVariations.value = Array.from({ length: transformedProduct.attributes.length }).fill(null);
    resetDisabledStatus();
  } else {
    selectedVariations.value[index] = Number(selectedValue);
  }

  updateAvailableOptions();

  const variationId = getSelectedVariationId();
  if (variationId) {
    const delimiter = '-';
    const slugParts = route.params.slug?.toString().split(delimiter);
    if (!slugParts) return;

    const link = `${slugParts.slice(0, -1).join(delimiter)}${delimiter}${variationId}`;
    router.push({ name: route.name, params: { slug: link } });
  }
};

watchEffect(() => {
  updateAvailableOptions();
});
</script>
