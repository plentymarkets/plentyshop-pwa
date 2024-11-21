<template>
  <RecommendedProducts v-if="loadComponent" :products="recommendedProducts"></RecommendedProducts>
</template>

<script setup lang="ts" async>
import type { ProductRecommendedProductsProps } from './types';

const props = defineProps<ProductRecommendedProductsProps>();
const { data: recommendedProducts, fetchProductRecommended } = useProductRecommended(props.categoryId + props.cacheKey);
const loadComponent = ref(false);
console.log('my cristian test', props, recommendedProducts, loadComponent.value);
if (props.categoryId) {
  await fetchProductRecommended(props.categoryId);
  loadComponent.value = true;
}
</script>
