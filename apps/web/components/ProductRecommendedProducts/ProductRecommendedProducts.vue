<template>
  <div v-if="recommendedProducts">
    <RecommendedProducts :products="recommendedProducts" />
  </div>
  <UiSkeletonLoader v-else />
</template>

<script setup lang="ts">
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

watch(recommendedProducts, (updatdProducts) => {
  if (updatdProducts.length > 0) {
    loadProducts.value = true;
  }
});
</script>
