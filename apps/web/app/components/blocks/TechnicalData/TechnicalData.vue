<template>
  <div :style="inlineStyle" data-testid="technical-data-block">
    <div v-if="displayAsCollapsable">
      <UiAccordionItem v-model="initiallyCollapsed"
        summary-class="md:rounded-md w-full hover:bg-neutral-100 py-2 pl-4 pr-3 flex justify-between items-center select-none"
        data-testid="technical-data">
        <template #summary>
          <h2 class="font-bold text-lg leading-6 md:text-2xl">
            {{ title }}
          </h2>
        </template>
        <div v-if="text" data-testid="technical-data-innertext" class="no-preflight" v-html="text" />
      </UiAccordionItem>
      <UiDivider v-if="initiallyCollapsed && text?.length" class="mb-2 mt-2" />
    </div>
    <div v-else>
      <h2 class="font-bold text-lg leading-6 md:text-2xl">
        {{ title }}
      </h2>
      <div v-if="text" class="no-preflight" v-html="text" />
    </div>

  </div>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import type { TechnicalDataProps } from './types';
const props = defineProps<TechnicalDataProps>();
const title = computed(() => props.content?.title);
const initiallyCollapsed = computed(() => !props.content?.initiallyCollapsed);
const displayAsCollapsable = computed(() => props.content?.displayAsCollapsable);
const { currentProduct } = useProducts();
const text = computed(() => productGetters.getTechnicalData(currentProduct.value));

const inlineStyle = computed(() => {
  const layout = props.content?.layout || {};
  return {
    paddingTop: layout.paddingTop ? `${layout.paddingTop}px` : 0,
    paddingBottom: layout.paddingBottom ? `${layout.paddingBottom}px` : 0,
    paddingLeft: layout.paddingLeft ? `${layout.paddingLeft}px` : 0,
    paddingRight: layout.paddingRight ? `${layout.paddingRight}px` : 0,
  };
});
</script>
