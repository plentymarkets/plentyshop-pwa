<template>
  <div v-bind="$attrs">
    <TextContent data-testid="recommended-block" class="pb-4" :text="props.content.text" :index="props.index" />
    <ProductSlider
      v-if="recommendedProducts?.length && (shouldRender || shouldRenderAfterUpdate)"
      :items="recommendedProducts"
    />
  </div>
</template>

<script setup lang="ts">
import type { ProductRecommendedProductsProps } from './types';
import { productGetters } from '@plentymarkets/shop-api';

const props = withDefaults(defineProps<ProductRecommendedProductsProps>(), { shouldLoad: undefined });

const { locale } = useI18n();
const { data: categoryTree } = useCategoryTree();
const { currentProduct } = useProducts();

const itemId = computed(() =>
  Object.keys(currentProduct.value).length
    ? productGetters.getItemId(currentProduct.value)
    : props.content.source.itemId,
);

const firstCategoryId = categoryTree.value?.find((category) => category.type === 'item')?.id || '';
const categoryId = productGetters.getCategoryIds(currentProduct.value)[0] ?? '';

const shouldRenderAfterUpdate = ref(false);

const { data: recommendedProducts, fetchProductRecommended } = useProductRecommended(props.meta.uuid);

const isCategory = computed(() => props.content.source?.type === 'category');
const isProduct = computed(() => props.content.source?.type === 'cross_selling' && itemId.value);
const shouldRender = computed(() => props.shouldLoad === undefined || props.shouldLoad === true);
const shouldFetch = computed(() => shouldRender.value && (isCategory.value || isProduct.value));

const getContentSource = () => {
  const source = {
    ...props.content.source,
    ...{
      categoryId: props.content.source?.categoryId || (categoryId || firstCategoryId || '').toString(),
      itemId: itemId.value,
    },
  };
  return source;
};

const hasValidSource = computed(() => {
  const source = getContentSource();
  // For category type, we need a valid categoryId
  if (source.type === 'category') {
    return Boolean(source.categoryId && source.categoryId !== '');
  }
  // For cross_selling type, we need a valid itemId
  if (source.type === 'cross_selling') {
    return Boolean(source.itemId);
  }
  return false;
});

watch(
  shouldFetch,
  (visible) => {
    if (visible && hasValidSource.value) {
      fetchProductRecommended(getContentSource());
    }
    shouldRenderAfterUpdate.value = true;
  },
  { immediate: true },
);

watch(
  [
    () => props.content.source?.categoryId,
    () => props.content.source?.itemId,
    () => props.content.source?.type,
    () => props.content.source?.crossSellingRelation,
    () => locale.value,
  ],
  () => {
    if (shouldFetch.value && hasValidSource.value) {
      fetchProductRecommended(getContentSource());
    }
    shouldRenderAfterUpdate.value = true;
  },
);
</script>
