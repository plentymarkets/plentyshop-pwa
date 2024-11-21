<template>
  <div v-if="recommendedProducts.length > 0">
    <RecommendedProducts :products="recommendedProducts" />
  </div>
  <UiSkeletonLoader v-else />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useProductRecommended } from '~/composables/useProductRecommended';
import type { ProductRecommendedProductsProps } from './types';

const props = defineProps<ProductRecommendedProductsProps>();
const { data: recommendedProducts, fetchProductRecommended } = useProductRecommended(props.categoryId + props.cacheKey);

const loadProducts = ref(false);

onMounted(async () => {
  if (props.categoryId) {
    await fetchProductRecommended(props.categoryId);
    loadProducts.value = true;
  }
});
</script>
