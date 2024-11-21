<template>
  <RecommendedProducts :products="recommendedProducts"></RecommendedProducts>
</template>

<script setup lang="ts">
import type { ProductRecommendedProductsProps } from './types';

const props = defineProps<ProductRecommendedProductsProps>();
const { data: recommendedProducts, fetchProductRecommended } = useProductRecommended();

await fetchProductRecommended('49');
console.log('here:', recommendedProducts.value);
</script>
