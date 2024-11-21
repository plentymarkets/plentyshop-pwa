<template>
  <RecommendedProducts :products="recommendedProducts"></RecommendedProducts>
</template>

<script setup lang="ts">
import type { ProductRecommendedProductsProps } from './types';

const props = defineProps<ProductRecommendedProductsProps>();
const emit = defineEmits(['data-fetched']);
const { data: recommendedProducts, fetchProductRecommended } = useProductRecommended(props.categoryId + props.cacheKey);

const fetchData = async () => {
  if (props.categoryId) {
    await fetchProductRecommended(props.categoryId);
    emit('data-fetched');
  }
};

watch(() => props.categoryId, fetchData, { immediate: true });
</script>
