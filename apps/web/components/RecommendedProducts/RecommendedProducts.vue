<template>
  <ProductSlider v-if="recommendedProducts?.length" :items="recommendedProducts" />
</template>

<script setup lang="ts">
import type { RecommendedProductsProps } from './types';

const props = defineProps<RecommendedProductsProps>();
const { data: recommendedProducts, fetchProductRecommended } = useProductRecommended(props.categoryId + props.cacheKey);

if (props.categoryId) {
  fetchProductRecommended(props.categoryId);
}
</script>
