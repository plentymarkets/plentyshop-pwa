<template>
  <ClientOnly>
    <EditablePage :identifier="'0'" :type="'product'" />
  </ClientOnly>
</template>

<script setup lang="ts">
import type { Product } from '@plentymarkets/shop-api';
import { productGetters, categoryTreeGetters } from '@plentymarkets/shop-api';
const { setCurrentProduct } = useProducts();
const { setBlocksListContext } = useBlocksList();
const { setProductMetaData, setProductRobotsMetaData, setProductCanonicalMetaData } = useStructuredData();
const { productForEditor, fetchProduct, setProductMeta, setBreadcrumbs } = useProduct('');
const product = ref(productForEditor);
const { disableActions } = useEditor();
const { data: categoryTree } = useCategoryTree();
const { setPageMeta } = usePageMeta();
const { resetNotification } = useEditModeNotification(disableActions);
definePageMeta({
  pageType: 'static',
  type: 'product',
  identifier: 0,
});
useSeoMeta({
  robots: () => 'noindex',
});
const showRecommended = ref(false);
const recommendedSection = ref<HTMLElement | null>(null);
const productName = computed(() => productGetters.getName(product.value));
const icon = 'sell';
setPageMeta(productName.value, icon);

await fetchProduct().then(() => {
  usePlentyEvent().emit('frontend:productLoaded', {
    product: product.value,
  });
});

if (Object.keys(product.value).length === 0) {
  if (import.meta.client) showError({ statusCode: 404, statusMessage: 'Product not found' });

  throw createError({
    statusCode: 404,
    statusMessage: 'Product not found',
  });
}

setCurrentProduct(product.value || ({} as Product));
setProductMeta();
setBlocksListContext('product');
setBreadcrumbs();

watch(
  disableActions,
  () => {
    setCurrentProduct(productForEditor.value || ({} as Product));
  },
  { immediate: true },
);

watch(
  () => categoryTree.value,
  (categoriesTree) => {
    setProductCanonicalMetaData(product.value);
    const productCategoryId = productGetters.getParentCategoryId(product.value);
    if (categoriesTree.length > 0 && productCategoryId) {
      const categoryTree = categoriesTree.find(
        (categoryTree) => categoryTreeGetters.getId(categoryTree) === productCategoryId,
      );
      if (categoryTree) {
        setProductMetaData(product.value, categoryTree);
        setProductRobotsMetaData(product.value);
      }
    }
  },
  { immediate: true },
);

const observeRecommendedSection = () => {
  if (import.meta.client && recommendedSection.value) {
    const observer = new window.IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          showRecommended.value = true;
          observer.disconnect();
        }
      },
      {
        threshold: 0,
        rootMargin: '0px 0px 250px 0px',
      },
    );
    observer.observe(recommendedSection.value);
  }
};

onBeforeRouteLeave(() => {
  resetNotification();
  setCurrentProduct({} as Product);
});

onNuxtReady(() => observeRecommendedSection());
</script>
