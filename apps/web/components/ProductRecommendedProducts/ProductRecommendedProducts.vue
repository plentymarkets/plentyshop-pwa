<template>
  <RecommendedProducts v-if="loadComponent" :products="recommendedProducts"></RecommendedProducts>
</template>

<script setup lang="ts" async>
import type { ProductRecommendedProductsProps } from './types';

const props = defineProps<ProductRecommendedProductsProps>();
const { data: recommendedProducts, fetchProductRecommended } = useProductRecommended(props.categoryId + props.cacheKey);
const loadComponent = ref(false);
console.log('my cristian test 1', props, recommendedProducts, loadComponent.value);
onMounted(async () => {
  await fetchProductRecommended(props.categoryId);
  loadComponent.value = true;
  console.log('my cristian test 2', props, recommendedProducts, loadComponent.value);
});
</script>
