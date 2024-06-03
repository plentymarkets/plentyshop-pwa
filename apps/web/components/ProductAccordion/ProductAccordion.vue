<!-- CHANGES -->
<template>
  <div data-testid="product-accordion">
    <UiAccordionItem
      v-if="productGetters.getDescription(product)?.length"
      summary-class="md:rounded-md w-full hover:bg-neutral-100 py-2 pl-4 pr-3 flex justify-between items-center select-none"
      v-model="productDetailsOpen"
    >
      <template #summary>
        <h2 class="font-bold font-headings text-lg leading-6 md:text-2xl">
          {{ $t('productDetails') }}
        </h2>
      </template>
      <div v-html="productGetters.getDescription(product)"></div>
    </UiAccordionItem>
    <UiDivider class="mb-2 mt-2 !border-primary-700" />
    <UiAccordionItem
      v-if="productGetters.getTechnicalData(product)?.length"
      summary-class="md:rounded-md w-full hover:bg-neutral-100 py-2 pl-4 pr-3 flex justify-between items-center select-none"
      v-model="technicalDataOpen"
    >
      <template #summary>
        <h2 class="font-bold font-headings text-lg leading-6 md:text-2xl">
          {{ $t('technicalData') }}
        </h2>
      </template>
      <div v-html="productGetters.getTechnicalData(product)"></div>
    </UiAccordionItem>
    <UiDivider class="mb-2 mt-2 !border-primary-700" />
    <div class="py-2 pl-4 pr-3">
      <h2 class="font-bold font-headings text-lg leading-6 md:text-2xl">
        Pflege
      </h2>
      <p>
        Diese kleinen Helfer sind ideal, wenn der Hut etwas zu weit sitzt
        oder wenn Sie eine Zwischengröße bräuchten. Hierfür müssen Sie
        einfach nur die Korkeinlagen seitlich unter das Schweißband legen -
        sie halten ohne weitere Hilfsmittel.
      </p>
      <NuxtLazyHydrate when-visible>
        <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
          <ProductById itemId="72214" />
          <ProductById itemId="72214" /> 
        </div>
        
      </NuxtLazyHydrate>
    </div>
    <UiDivider class="mb-2 mt-2 !border-primary-700" />
  </div>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-sdk';
import type { ProductAccordionPropsType } from '~/components/ProductAccordion/types';

const props = defineProps<ProductAccordionPropsType>();

const { product } = toRefs(props);

const productDetailsOpen = ref(true);
const technicalDataOpen = ref(false);
</script>
