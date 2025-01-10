<template>
  <div class="text-2xl" v-if="preTitle">{{ preTitle }}</div>
  <h2
    v-if="headline"
    class="typography-display-3 md:typography-display-2 lg:typography-display-2 font-bold lg:leading-[4rem]"
    data-testid="recommended-products-headline"
  >
    {{ headline }}
  </h2>
  <div class="text-2xl" v-if="subTitle">{{ subTitle }}</div>
  <div v-if="htmlDescription" v-html="htmlDescription"></div>
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
