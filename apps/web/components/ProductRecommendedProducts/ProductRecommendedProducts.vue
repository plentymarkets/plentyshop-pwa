<template>
  <p
    v-if="headline"
    data-testid="recommended-products-headline"
    class="mb-4 typography-text-lg text-center md:text-left"
  >
    {{ headline }}
  </p>

  <ProductSlider v-if="recommendedProducts?.length" :items="recommendedProducts" />
</template>

<script setup lang="ts">
import type { ProductRecommendedProductsProps } from './types';

const props = defineProps<ProductRecommendedProductsProps>();
const { data: recommendedProducts, fetchProductRecommended } = useProductRecommended(props.categoryId + props.cacheKey);
if (props.categoryId) {
  fetchProductRecommended(props.categoryId);
}
</script>
