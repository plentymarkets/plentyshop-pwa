<template>
  <template v-if="crossSellingItems.products.length > 0">
    <h2 v-if="showTitle" class="mb-6 font-bold text-xl">{{ title }}</h2>
    <ProductSlider v-if="crossSellingItems" :items="crossSellingItems.products" />
  </template>
  <div v-if="!crossSellingItems" class="flex justify-center py-10">
    <SfLoaderCircular size="xl" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { productGetters } from '@plentymarkets/shop-api';
import { SfLoaderCircular } from '@storefront-ui/vue';

import type { CrossSellingProps, CrossSellingRelation } from './types';

const props = defineProps<CrossSellingProps>();

const itemId = productGetters.getItemId(props.product);

const { fetchProducts: fetchCrossSelling, data: crossSellingItems } = useProducts(
  'crossSelling' + itemId + props.crossSellingRelation,
);

fetchCrossSelling({
  itemId,
  type: 'cross_selling',
  crossSellingRelation: props.crossSellingRelation,
});

const LABELS: Record<CrossSellingRelation, string> = {
  Similar: 'Ähnliche Produkte',
  Accessory: 'Zubehör',
  Bundle: 'Bundle-Angebote',
  ReplacementPart: 'Ersatzteile',
};

const title = computed(() => props.title ?? LABELS[props.crossSellingRelation]);
const showTitle = computed(() => props.showTitle ?? true);
</script>
