<template>
  <div v-bind="$attrs">
    <TextContent data-testid="recommended-block" class="pb-4" :text="props.content.text" :index="props.index" />
    <ProductSlider v-if="recommendedProducts?.length && shouldRender" :items="recommendedProducts" />
  </div>
</template>

<script setup lang="ts">
import type { ProductRecommendedProductsProps } from './types';

const props = withDefaults(defineProps<ProductRecommendedProductsProps>(), { shouldLoad: undefined });

const { locale } = useI18n();
const { data: recommendedProducts, fetchProductRecommended } = useProductRecommended(
  props.content.categoryId + (props.content.cacheKey || ''),
);

const shouldRender = computed(() => props.shouldLoad === undefined || props.shouldLoad === true);
const shouldFetch = computed(() => shouldRender.value && props.content.categoryId);

watch(
  shouldFetch,
  (visible) => {
    if (visible) fetchProductRecommended(props.content.categoryId);
  },
  { immediate: true },
);

watch([() => props.content.categoryId, () => locale], () => {
  if (shouldFetch.value) fetchProductRecommended(props.content.categoryId);
});
</script>
