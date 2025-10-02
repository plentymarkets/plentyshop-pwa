<template>
  <div :class="shouldHideOverflow ? 'overflow-x-hidden' : ''" v-bind="$attrs" :style="inlineStyle">
    <TextContent data-testid="recommended-block" class="pb-4" :text="props.content.text" :index="props.index" />
    <ProductSlider v-if="recommendedProducts?.length && shouldRender" :items="recommendedProducts" />
  </div>
</template>

<script setup lang="ts">
import type { ProductRecommendedProductsProps } from './types';

const props = withDefaults(defineProps<ProductRecommendedProductsProps>(), { shouldLoad: undefined });

const { getBlockDepth } = useBlockManager();
const { blockUuid } = useSiteConfiguration();

const blockDepth = computed(() => {
  return getBlockDepth(props.meta.uuid || blockUuid.value);
});
const { defaultMarginLeft, defaultMarginRight } = useDefaultMargins({
  blockDepth: blockDepth.value,
  defaultMargin: 40,
});

const { locale } = useI18n();
const { data: recommendedProducts, fetchProductRecommended } = useProductRecommended(
  props.content.categoryId + (props.content.cacheKey || ''),
);

const shouldRender = computed(() => props.shouldLoad === undefined || props.shouldLoad === true);
const shouldFetch = computed(() => shouldRender.value && props.content.categoryId);
const MAX_SAFE_MARGIN = 1000;
const shouldHideOverflow = computed(() => {
  const layout = props.content.layout || {};
  return Math.abs(layout.marginLeft || 0) > MAX_SAFE_MARGIN || Math.abs(layout.marginRight || 0) > MAX_SAFE_MARGIN;
});

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

const inlineStyle = computed(() => {
  const layout = props.content.layout || {};

  return {
    marginTop: layout.marginTop ? `${layout.marginTop}px` : 0,
    marginBottom: layout.marginBottom ? `${layout.marginBottom}px` : 0,
    marginLeft: layout.marginLeft ? `${layout.marginLeft}px` : `${defaultMarginLeft.value}px`,
    marginRight: layout.marginRight ? `${layout.marginRight}px` : `${defaultMarginRight.value}px`,
  };
});
</script>
