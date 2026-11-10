<template>
  <div
    v-if="productGetters.possibleUnitCombination(product).length > 1"
    class="mt-2"
    data-testing="variation-select-unit-wrapper"
  >
    <div class="input-unit w-full">
      <label
        class="leading-5 text-sm text-zinc-900"
        for="unit-combination"
        data-testing="variation-select-unit-label"
        >{{ t('common.labels.content') }}</label
      >
      <SfSelect
        id="unit-combination"
        class="custom-select w-full"
        data-testing="variation-select-unit"
        :model-value="selectedUnit"
        @update:model-value="(event) => onChange(Number(event))"
      >
        <option
          v-for="unit in productGetters.possibleUnitCombination(product)"
          :key="unit.variationId"
          :value="unit.variationId"
          :selected="unit.variationId.toString() === selectedUnit"
          :disabled="!isUnitAvailableForCurrentFlavor(unit.unitCombinationId)"
        >
          {{ unit.unitName }}
        </option>
      </SfSelect>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfSelect } from '@storefront-ui/vue';
import { type Product, productGetters } from '@plentymarkets/shop-api';

const props = defineProps<{
  product: Product;
}>();

const route = useRoute();
const localePath = useLocalizedPath();
const { attributeValues } = useProductAttributes();

const selectedUnit = computed(() => {
  const currentUnitCombinationId = props.product.variation?.unitCombinationId;
  const match = productGetters
    .possibleUnitCombination(props.product)
    .find((unit) => unit.unitCombinationId === currentUnitCombinationId);

  return (match?.variationId ?? productGetters.getVariationId(props.product)).toString();
});

function findVariationForUnitCombination(targetUnitCombinationId: number | undefined) {
  return props.product.variationAttributeMap?.variations.find((variation) => {
    if (variation.unitCombinationId !== targetUnitCombinationId) {
      return false;
    }
    return Object.entries(attributeValues.value).every(([attributeId, valueId]) =>
      variation.attributes?.some(
        (attribute) => attribute.attributeId === Number(attributeId) && attribute.attributeValueId === valueId,
      ),
    );
  });
}

function isUnitAvailableForCurrentFlavor(unitCombinationId: number): boolean {
  return Boolean(findVariationForUnitCombination(unitCombinationId));
}

function onChange(value: number) {
  const targetUnitCombinationId = productGetters
    .possibleUnitCombination(props.product)
    .find((unit) => unit.variationId === value)?.unitCombinationId;

  const matchingVariation = findVariationForUnitCombination(targetUnitCombinationId);

  navigateTo({
    path: localePath(
      `/${productGetters.getUrlPath(props.product)}_${productGetters.getItemId(props.product)}_${matchingVariation?.variationId ?? value}`,
    ),
    query: route.query,
  });
}
</script>
