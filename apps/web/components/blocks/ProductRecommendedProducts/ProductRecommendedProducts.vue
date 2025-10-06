<template>
  <div :class="hideOverflow ? 'overflow-x-hidden' : ''" v-bind="$attrs" :style="inlineStyle">
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
const { defaultMarginLeft, defaultMarginRight, shouldHideOverflow } = useDefaultMargins({
  blockDepth: blockDepth.value,
  defaultMargin: 40,
});

const hideOverflow = computed(() => shouldHideOverflow(props.content.layout || {}));
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
