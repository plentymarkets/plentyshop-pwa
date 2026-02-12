<template>
  <NuxtLayout name="default" :breadcrumbs="breadcrumbs">
    <template v-if="hasHeaderBlocks" #header>
      <EditableBlocks :blocks="headerBlocks" />
    </template>
    <EditableBlocks :blocks="mainBlocks" />
    <UiReviewModal />
    <ProductLegalDetailsDrawer v-if="open" :product="product" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { Product, Block } from '@plentymarkets/shop-api';
import type { Locale } from '#i18n';
import { productGetters, categoryTreeGetters } from '@plentymarkets/shop-api';
import productTemplateData from '~/composables/useCategoryTemplate/productTemplateData.json';

defineI18nRoute({
  locales: process.env.LANGUAGELIST?.split(',') as Locale[],
});
const route = useRoute();
const { setCurrentProduct } = useProducts();
const { setBlocksListContext } = useBlocksList();
const { setProductMetaData, setProductRobotsMetaData, setProductCanonicalMetaData } = useStructuredData();
const { buildProductLanguagePath } = useLocalization();
const { productParams, productId } = createProductParams(route.params);
const { productForEditor, fetchProduct, setProductMeta, setBreadcrumbs, breadcrumbs } = useProduct(productId);
const product = productForEditor;
const { disableActions } = useEditor();
const { fetchProductReviews, fetchProductAuthenticatedReviews } = useProductReviews(Number(productId));
const { data: categoryTree } = useCategoryTree();
const { open } = useProductLegalDetailsDrawer();
const { setPageMeta } = usePageMeta();
const { resetNotification } = useEditModeNotification(disableActions);
const { isAuthorized } = useCustomer();

definePageMeta({
  layout: false,
  path: '/:slug*_:itemId',
  validate: async (route) => {
    return validateProductParams(route.params);
  },
  type: 'product',
  isBlockified: true,
  identifier: 0,
});

const showRecommended = ref(false);
const recommendedSection = ref<HTMLElement | null>(null);
const productName = computed(() => productGetters.getName(product.value));
const icon = 'sell';
setPageMeta(productName.value, icon);

await fetchProduct(productParams).then(() => {
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

setCurrentProduct(productForEditor.value || ({} as Product));
setProductMeta();
setBlocksListContext('product');
setBreadcrumbs();

const { $i18n } = useNuxtApp();
const productIdentifier = '0';

const { data, getBlocksServer, setDefaultTemplate, headerBlocks, mainBlocks } = useCategoryTemplate(
  productIdentifier,
  'product',
  $i18n.locale.value,
);

const hasHeaderBlocks = computed(() => headerBlocks.value.length > 0);

setDefaultTemplate(productTemplateData as Block[]);
await getBlocksServer(productIdentifier, 'product');

const { ensureAllGlobalBlocks } = useGlobalBlocks();
const blocksWithGlobals = await ensureAllGlobalBlocks(data.value);

if (blocksWithGlobals.length !== data.value.length) data.value.splice(0, data.value.length, ...blocksWithGlobals);

async function fetchReviews() {
  const productVariationId = productGetters.getVariationId(product.value);
  await fetchProductReviews(Number(productId), productVariationId);
  if (isAuthorized.value) {
    await fetchProductAuthenticatedReviews(Number(productId), productVariationId);
  }
}
await fetchReviews();

watch(
  disableActions,
  () => {
    setCurrentProduct(productForEditor.value || ({} as Product));
  },
  { immediate: true },
);

/* TODO: This should only be temporary.
 *  It changes the url of the product page while on the page and switching the locale.
 *  Should be removed when the item search is refactored.
 */
watch(
  () => product.value.texts.urlPath,
  (value, oldValue) => {
    if (value !== oldValue) {
      navigateTo({
        path: buildProductLanguagePath(
          `/${productGetters.getUrlPath(product.value)}_${productGetters.getItemId(product.value)}`,
        ),
        query: route.query,
        replace: true,
      });
    }
  },
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

watch(
  () => route.params,
  () => {
    const productName = computed(() => productGetters.getName(product.value));
    const icon = 'sell';
    setPageMeta(productName.value, icon);
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
});

onNuxtReady(() => observeRecommendedSection());
</script>
