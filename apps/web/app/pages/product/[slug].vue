<template>
  <NuxtLayout name="default" :breadcrumbs="breadcrumbs">
    <EditablePage v-if="config.enableProductEditing" :identifier="'0'" :type="'product'" />

    <NarrowContainer v-else>
      <div class="md:grid gap-x-6 grid-areas-product-page grid-cols-product-page">
        <section class="grid-in-left-top md:h-full xl:max-h-[700px]">
          <Gallery :images="addModernImageExtensionForGallery(productGetters.getGallery(product))" />
        </section>
        <section class="mb-10 grid-in-right md:mb-0">
          <UiPurchaseCard v-if="product" :product="product" :review-average="countsProductReviews" />
        </section>
        <section class="grid-in-left-bottom md:mt-8">
          <UiDivider class="mt-4 mb-2 md:mt-8" />
          
          <!-- <NuxtLazyHydrate when-visible>
            <BlocksItemText v-if="product && productGetters.getDescription(product).length" :ItemTextProps="localItemProps" />
          </NuxtLazyHydrate> -->
          
          <NuxtLazyHydrate when-visible>
            <ProductAccordion v-if="product" :product="product" />
          </NuxtLazyHydrate>
          <ReviewsAccordion
            v-if="product"
            :product="product"
            :total-reviews="reviewGetters.getTotalReviews(countsProductReviews)"
          />

          <div class="p-4 flex">
            <p class="font-bold leading-6 cursor-pointer" data-testid="open-manufacturer-drawer" @click="openDrawer()">
              <span>{{ t('legalDetails') }}</span>
              <SfIconChevronRight />
            </p>
          </div>
        </section>
      </div>

      <section ref="recommendedSection" class="mx-4 mt-28 mb-20">
        <component
          :is="RecommendedProductsAsync"
          v-if="showRecommended"
          :category-id="productGetters.getCategoryIds(product)[0] ?? ''"
        />
      </section>
    </NarrowContainer>

    <UiReviewModal />
    <ProductLegalDetailsDrawer v-if="open" :product="product" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { SfIconChevronRight } from '@storefront-ui/vue';
import type { Product } from '@plentymarkets/shop-api';
import { productGetters, reviewGetters, categoryTreeGetters } from '@plentymarkets/shop-api';

const route = useRoute();
const { t } = useI18n();
const { setCurrentProduct } = useProducts();
const { setProductMetaData, setProductRobotsMetaData, setProductCanonicalMetaData } = useStructuredData();
const { buildProductLanguagePath } = useLocalization();
const { addModernImageExtensionForGallery } = useModernImage();
const { productParams, productId } = createProductParams(route.params);
const { data: product, fetchProduct, setProductMeta, setBreadcrumbs, breadcrumbs } = useProduct(productId);
const { data: productReviews, fetchProductReviews } = useProductReviews(Number(productId));
const { data: categoryTree } = useCategoryTree();
const { open, openDrawer } = useProductLegalDetailsDrawer();
const { setPageMeta } = usePageMeta();
import type { ItemTextContent } from '~/components/blocks/ItemText/types';

const config = useRuntimeConfig().public;

definePageMeta({
  layout: false,
  path: '/:slug*_:itemId',
  validate: async (route) => {
    return validateProductParams(route.params);
  },
  type: 'product',
  isBlockified: false,
  identifier: 0,
});
const RecommendedProductsAsync = defineAsyncComponent(
  async () => await import('~/components/RecommendedProducts/RecommendedProducts.vue'),
);

const showRecommended = ref(false);
const recommendedSection = ref<HTMLElement | null>(null);
const productName = computed(() => productGetters.getName(product.value));
const localItemProps = computed(() => {
  return { 
    title: 'test',
    type: '',
    content: {
      title: 'title luat din getBlocks call'
    },
    product: product.value,
    meta: {
        uuid: 'meta uid luat din baza de data din fetch - din getBlocks'
    }
  };
})
const icon = 'sell';
setPageMeta(productName.value, icon);

const countsProductReviews = computed(() => reviewGetters.getReviewCounts(productReviews.value));

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
setCurrentProduct(product.value || ({} as Product));
setProductMeta();

async function fetchReviews() {
  const productVariationId = productGetters.getVariationId(product.value);
  await fetchProductReviews(Number(productId), productVariationId);
}
await fetchReviews();

setBreadcrumbs();

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

onNuxtReady(() => observeRecommendedSection());
</script>
