<template>
  <div>
    <UiAccordionItem v-if="productGetters.getDescription(product)?.length" v-model="productDetailsOpen"
      summary-class="md:rounded-md w-full hover:bg-neutral-100 py-2 pl-4 pr-3 flex justify-between items-center select-none">
      <template #summary>
        <h2 class="font-bold text-lg leading-6 md:text-2xl">
          {{ t('productDetails') }}
        </h2>
      </template>
      <div class="no-preflight" v-html="productGetters.getDescription(product)" />
    </UiAccordionItem>
    <UiDivider v-if="productDetailsOpen && productGetters.getDescription(product)?.length" class="mb-2 mt-2" />
  </div>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';

const productDetailsOpen = ref(true);
const { t } = useI18n();
import type { ProductDetailsProps } from './types';
const props = defineProps<ProductDetailsProps>();
const { product } = toRefs(props);
</script>
