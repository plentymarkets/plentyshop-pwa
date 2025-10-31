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

const itemId = computed(() => Object.keys(currentProduct.value).length ? productGetters.getItemId(currentProduct.value) : props.content.source.itemId);

const firstCategoryId = categoryTree.value?.[0]?.id;

const shouldRenderAfterUpdate = ref(false);

const { data: recommendedProducts, fetchProductRecommended } = useProductRecommended(props.meta.uuid);

const shouldRender = computed(() => props.shouldLoad === undefined || props.shouldLoad === true);

const isCategory = computed(() => props.content.source?.type === 'category');
const isProduct = computed(() => props.content.source?.type === 'cross_selling');

const getContentSource = () => {
  return {
    ...props.content.source,
    ...{ categoryId: props.content.source?.categoryId || (firstCategoryId || '').toString(), itemId: itemId.value },
  };
};

const shouldFetch = computed(() => shouldRender.value && (isCategory.value || isProduct.value));

watch(
  shouldFetch,
  (visible) => {
    if (visible) fetchProductRecommended(getContentSource());
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
    if (shouldFetch.value && (
        (props.content.source?.itemId && props.content.source?.type === 'cross_selling') ||
        (props.content.source?.categoryId && props.content.source?.type === 'category')
      )
    ) fetchProductRecommended(getContentSource());
    shouldRenderAfterUpdate.value = true;
  },
);
</script>
