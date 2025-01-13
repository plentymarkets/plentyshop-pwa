<template>
  <div v-if="text?.pretitle" class="text-2xl">{{ text.pretitle }}</div>
  <h2
    v-if="text?.title"
    class="typography-display-3 md:typography-display-2 lg:typography-display-2 font-bold lg:leading-[4rem]"
    data-testid="recommended-products-headline"
  >
    {{ text.title }}
  </h2>
  <div v-if="text?.subtitle" class="text-2xl pb-1">{{ text.subtitle }}</div>
  <div
    class="typography-text-sm md:typography-text-lg font-normal"
    v-if="text?.htmlDescription"
    v-html="text.htmlDescription"
  ></div>
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
