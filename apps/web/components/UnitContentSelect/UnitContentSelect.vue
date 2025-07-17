<template>
  <div  class="mt-2" data-testing="variation-select-unit-wrapper">
    <div class="input-unit w-full">
      <label for="unit-combination" data-testing="variation-select-unit-label">{{ t('content') }}</label>
      <SfSelect
        id="unit-combination"
        class="custom-select w-full"
        data-testing="variation-select-unit"
        :model-value="selectedUnit"
        @update:model-value="(event) => onChange(Number(event))"
      >
        <option
          v-for="unit in productGetters.getAttributeMapVariations(product)"
          :key="unit.variationId"
          :value="unit.variationId"
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
  product: Product
}>()

const route = useRoute();
const { productParams } = createProductParams(route.params);
const { buildProductLanguagePath } = useLocalization();
const { t } = useI18n()

const selectedUnit = ref(productParams?.variationId?.toString() || '');

function onChange(value: number) {
  navigateTo({
    path: buildProductLanguagePath(
      `/${productGetters.getUrlPath(props.product)}_${productGetters.getItemId(props.product)}_${value}`,
    ),
    query: route.query,
  });
}
</script>
