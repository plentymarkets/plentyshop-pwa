<template>
  <RecommendedProducts :products="recommendedProducts"></RecommendedProducts>
</template>

<script setup lang="ts">
import type { ProductRecommendedProductsProps } from './types';

const props = defineProps<ProductRecommendedProductsProps>();
const { data: recommendedProducts, fetchProductRecommended } = useProductRecommended(props.categoryId + props.cacheKey);
console.log('before fetchProductRecommended', props, recommendedProducts);
if (props.categoryId) {
  fetchProductRecommended(props.categoryId);
  console.log('after fetchProductRecommended', props, recommendedProducts);
}
</script>
