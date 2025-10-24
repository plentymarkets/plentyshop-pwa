<template>
  <ProductSlider v-if="recommendedProducts?.length" :items="recommendedProducts" />
</template>

<script setup lang="ts">
import type { RecommendedProductsProps } from './types';

const props = withDefaults(defineProps<RecommendedProductsProps>(), { cacheKey: '' });
const { data: recommendedProducts, fetchProductRecommended } = useProductRecommended(props.categoryId + props.cacheKey);

if (props.categoryId) {
  fetchProductRecommended({ type: 'category', categoryId: String(props.categoryId) });
}
</script>
