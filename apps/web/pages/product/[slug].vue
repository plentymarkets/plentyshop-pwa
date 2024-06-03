<!-- CHANGES -->
<template>
  <NuxtLayout name="default" :breadcrumbs="breadcrumbs">
    <NarrowContainer>
      <div class="md:grid gap-x-6 grid-areas-product-page grid-cols-product-page">
        <section class="grid-in-left-top md:h-full xl:max-h-[700px]">
          <NuxtLazyHydrate when-idle>
            <Gallery :images="addModernImageExtensionForGallery(productGetters.getGallery(product))" />
          </NuxtLazyHydrate>
        </section>
        <section class="mb-10 grid-in-right md:mb-0">
          <NuxtLazyHydrate when-idle>
            <UiPurchaseCard v-if="product" :product="product" :review-average="productReviewAverage" />
          </NuxtLazyHydrate>
        </section>
      </div>
      <section class="md:mt-8">
        <UiDivider class="mt-4 mb-2 md:mt-8 !border-primary-700" />
        <NuxtLazyHydrate when-visible>
          <ProductAccordion v-if="product" :product="product" />
        </NuxtLazyHydrate>
        <!--<NuxtLazyHydrate when-visible>
          <ReviewsAccordion :product="product" :total-reviews="reviewGetters.getTotalReviews(productReviewAverage)" />
        </NuxtLazyHydrate>-->
      
      </section>
      <section class="mx-4 mt-28 mb-20">
        <NuxtLazyHydrate when-visible>
          <ProductRecommendedProducts
            :category-id="productGetters.getCategoryIds(product)[0]"
          ></ProductRecommendedProducts>
        </NuxtLazyHydrate>
      </section>
      <div class="brand-section bg-gray-300">
        <div class="grid grid-cols-8 items-center">
          <div class="col-span-4 md:col-span-3 h-full overflow-hidden bg-[url('/images/Markenbild_Borsalino.jpg')] min-h-96 bg-cover bg-center">
            <!--<img src="" class="object-cover w-auto max-w-none md:max-w-full">-->
          </div>
          <div class="col-span-4 md:col-span-5 p-10">
            <h3 class="font-bold">Mayser</h3>
            <p>
              Mayser gehört zu den führenden Hutherstellern in Deutschland und ist bekannt für seine erstklassige Qualität 
              und handwerkliches Können. Seit 1800 fertigt das Unternehmen Hüte in Europa, wobei es sich besonders auf Produkte 
              mit zertifiziertem UV-Schutz spezialisiert hat. Mayser bietet eine breite Palette von Hutstilen, die sowohl traditionell als auch modern sind.
            </p>
          </div>
        </div>
        
      </div>
    </NarrowContainer>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { Product } from '@plentymarkets/shop-api';
import { productGetters, reviewGetters } from '@plentymarkets/shop-sdk';

const { data: categoryTree } = useCategoryTree();
const { setProductMetaData } = useStructuredData();
const route = useRoute();
const { selectVariation } = useProducts();
const { buildProductLanguagePath } = useLocalization();
const { addModernImageExtensionForGallery } = useModernImage();

definePageMeta({
  layout: false,
});

const { productParams, productId } = createProductParams(route.params);
const { data: product, fetchProduct, setTitle, generateBreadcrumbs, breadcrumbs } = useProduct(productId);
const { data: productReviewAverage, fetchProductReviewAverage } = useProductReviewAverage(productId);
const { fetchProductReviews } = useProductReviews(Number(productId));
if (process.server) {
  await Promise.all([
    fetchProduct(productParams),
    fetchProductReviewAverage(Number(productId)),
    fetchProductReviews(Number(productId)),
  ]);
  setProductMetaData(product.value, categoryTree.value[0]);
} else {
  await Promise.all([fetchProduct(productParams), fetchProductReviewAverage(Number(productId))]);
}
selectVariation(productParams.variationId ? product.value : ({} as Product));
setTitle();
generateBreadcrumbs();
// eslint-disable-next-line unicorn/expiring-todo-comments
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
      });
    }
  },
);

</script>
