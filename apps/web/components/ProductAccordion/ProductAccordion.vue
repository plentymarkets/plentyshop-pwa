<template>
  <div data-testid="product-accordion">
    <UiAccordionItem
      v-if="productGetters.getDescription(product)?.length"
      v-model="productDetailsOpen"
      summary-class="md:rounded-md w-full hover:bg-neutral-100 py-2 pl-4 pr-3 flex justify-between items-center select-none"
    >
      <template #summary>
        <h2 class="font-bold text-lg leading-6 md:text-2xl">
          {{ $t('productDetails') }}
        </h2>
      </template>
      <div class="no-preflight" v-html="productGetters.getDescription(product)" />
    </UiAccordionItem>
    <UiDivider v-if="productDetailsOpen && productGetters.getDescription(product)?.length" class="mb-2 mt-2" />
    <UiAccordionItem
      v-if="productGetters.getTechnicalData(product)?.length"
      v-model="technicalDataOpen"
      summary-class="md:rounded-md w-full hover:bg-neutral-100 py-2 pl-4 pr-3 flex justify-between items-center select-none"
    >
      <template #summary>
        <h2 class="font-bold text-lg leading-6 md:text-2xl">
          {{ $t('technicalData') }}
        </h2>
      </template>
      <div class="no-preflight" v-html="productGetters.getTechnicalData(product)" />
    </UiAccordionItem>
    <UiDivider v-if="technicalDataOpen && productGetters.getTechnicalData(product)?.length" class="mb-2 mt-2" />
  </div>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import type { ProductAccordionPropsType } from '~/components/ProductAccordion/types';

const props = defineProps<ProductAccordionPropsType>();

const { product } = toRefs(props);

const productDetailsOpen = ref(true);
const technicalDataOpen = ref(false);
</script>
