<template>
  <div v-bind="$attrs">
    <TextContent data-testid="recommended-block" class="pb-4" :text="props.content.text" :index="props.index" />
    <ProductSlider v-if="recommendedProducts?.length && shouldLoad" :items="recommendedProducts" />
  </div>
</template>

<script setup lang="ts">
import type { ProductRecommendedProductsProps } from './types';
const { locale } = useI18n();

const props = withDefaults(defineProps<ProductRecommendedProductsProps>(), { shouldLoad: false });

const { data: recommendedProducts, fetchProductRecommended } = useProductRecommended(
  props.content.categoryId + props.content.cacheKey,
);

// Only fetch when visible and categoryId exists
const shouldFetch = computed(() => props.shouldLoad && props.content.categoryId);

// Watch for visibility changes and fetch data
watch(
  shouldFetch,
  (visible) => {
    if (visible) {
      fetchProductRecommended(props.content.categoryId);
    }
  },
  { immediate: true },
);

// Watch for locale changes and refetch if already visible
watch([() => props.content.categoryId, () => locale], () => {
  if (shouldFetch.value) {
    fetchProductRecommended(props.content.categoryId);
  }
});
</script>
