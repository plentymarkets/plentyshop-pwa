<template>
  <ProductSlider v-if="products?.length" :items="products" />
</template>

<script setup lang="ts">
import type { RecommendedProductsProps } from '~/components/RecommendedProducts/types';

const props = defineProps<RecommendedProductsProps>();

console.log('RecommendedProducts', props);
</script>
