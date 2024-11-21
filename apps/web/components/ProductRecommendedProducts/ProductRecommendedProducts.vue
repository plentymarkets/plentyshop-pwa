<template>
  <RecommendedProducts :products="recommendedProducts"></RecommendedProducts>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, onMounted } from 'vue';
import type { ProductRecommendedProductsProps } from './types';

const props = defineProps<ProductRecommendedProductsProps>();
const emit = defineEmits(['data-fetched']);
const { data: recommendedProducts, fetchProductRecommended } = useProductRecommended(props.categoryId + props.cacheKey);

async function fetchData() {
  if (props.categoryId) {
    await fetchProductRecommended(props.categoryId);
    emit('data-fetched');
  }
}

onMounted(fetchData);
</script>
