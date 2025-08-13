<template>
  <div v-bind="$attrs">
    <TextContent data-testid="recommended-block" class="pb-4" :text="props.content.text" :index="props.index" />
    <ProductSlider v-if="recommendedProducts?.length" :items="recommendedProducts" />
  </div>
</template>

<script setup lang="ts">
import type { ProductRecommendedProductsProps } from './types';
const { locale } = useI18n();
const props = defineProps<ProductRecommendedProductsProps>();
const { data: recommendedProducts, fetchProductRecommended } = useProductRecommended(
  props.content.categoryId + props.content.cacheKey,
);

if (props.content.categoryId) {
  fetchProductRecommended(props.content.categoryId);
}

watch([() => props.content.categoryId, () => locale], () => {
  if (props.content.categoryId) {
    fetchProductRecommended(props.content.categoryId);
  }
});
</script>
