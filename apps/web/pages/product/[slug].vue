<template>
  <NuxtLayout name="default" :breadcrumbs="breadcrumbs">
    <NarrowContainer>
      <div class="md:grid gap-x-6 grid-areas-product-page grid-cols-product-page">
        <section class="grid-in-left-top md:h-full xl:max-h-[700px]">
          <NuxtLazyHydrate when-idle>
            <Gallery :images="productGetters.getGallery(product)" />
          </NuxtLazyHydrate>
        </section>
        <section class="mb-10 grid-in-right md:mb-0">
          <NuxtLazyHydrate when-idle>
            <UiPurchaseCard v-if="product" :product="product" :review-average="productReviewAverage" />
          </NuxtLazyHydrate>
        </section>
        <section class="grid-in-left-bottom md:mt-8">
          <UiDivider class="mt-4 mb-2 md:mt-8" />
          <NuxtLazyHydrate when-visible>
            <ProductAccordion v-if="product" :product="product" />
          </NuxtLazyHydrate>
          <UiDivider class="mt-4 mb-2 md:mt-8" />
          <NuxtLazyHydrate when-visible>
            <ReviewsAccordion :product="product" />
          </NuxtLazyHydrate>
        </section>
        <UiDivider class="mt-4 mb-2" />
      </div>
      <section class="mx-4 mt-28 mb-20">
        <NuxtLazyHydrate when-visible>
          <ProductRecommendedProducts :product="product"></ProductRecommendedProducts>
        </NuxtLazyHydrate>
      </section>
    </NarrowContainer>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { categoryTreeGetters, productGetters } from '@plentymarkets/shop-sdk';

const { data: categoryTree } = useCategoryTree();

const route = useRoute();
const slug = route.params.slug as string;

const productId = slug.split('-').pop() ?? '0';

const { data: product, fetchProduct } = useProduct(productId);
const { data: productReviewAverage, fetchProductReviewAverage } = useProductReviewAverage(productId);

await fetchProduct(productId);
await fetchProductReviewAverage(product.value.item.id);

const { t } = useI18n();

const breadcrumbs = computed(() => {
  const breadcrumb = categoryTreeGetters.generateBreadcrumbFromCategory(
    categoryTree.value,
    Number(productGetters.getCategoryIds(product.value)?.[0] ?? 0),
  );
  breadcrumb.unshift({ name: t('home'), link: '/' });
  breadcrumb.push({ name: productGetters.getName(product.value), link: `#` });

  return breadcrumb;
});

if (product.value) {
  const productName = productGetters.getName(product.value);

  const title = computed(() => productName);

  useHead({
    title,
  });
}

definePageMeta({
  layout: false,
});
</script>
