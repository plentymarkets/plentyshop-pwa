<template>
  <Editor v-if="isEditing" />
  <div v-else class="content">
    <div v-if="!loading" class="max-w-screen-3xl mx-auto md:px-6 lg:px-10 mb-10">
      <UiHeroCarousel :hero-item-props="hero" />
    </div>
    <div v-else class="max-w-screen-3xl mx-auto md:px-6 lg:px-10 mb-10">
      <UiSkeletonLoader />
    </div>

    <NuxtLazyHydrate when-visible>
      <div v-if="!loading" class="max-w-screen-3xl mx-auto md:px-6 lg:px-10 mb-10">
        <UiMediaCard
          v-for="(item, index) in mediaCard"
          :key="index"
          :image="item.image"
          :alt="item.alt"
          :text="item.text"
          :alignment="item.alignment"
        />
      </div>
      <div v-else class="max-w-screen-3xl mx-auto md:px-6 lg:px-10 mb-10">
        <UiSkeletonLoader v-for="index in 3" :key="index" />
      </div>
    </NuxtLazyHydrate>

    <NuxtLazyHydrate when-visible>
      <template v-for="(item, index) in recommendedProductsCategories" :key="index">
        <section class="mb-10 overflow-hidden">
          <p data-testid="recommended-products" class="mb-4 typography-text-lg text-center md:text-left">
            {{ item.headline }}
          </p>
          <ProductRecommendedProducts cache-key="homepage" :category-id="item.categoryId" />
        </section>
      </template>
    </NuxtLazyHydrate>

    <NuxtLazyHydrate when-visible>
      <NewsletterSubscribe v-if="showNewsletter" />
    </NuxtLazyHydrate>
  </div>
</template>

<script lang="ts" setup async>
const { isEditing } = useEditor();
const { hero, mediaCard, recommendedProductsCategories, loading, fetchPageTemplateLocal } = useHomepage();
definePageMeta({ pageType: 'static', middleware: ['newsletter-confirmation'] });
const { showNewsletter } = useNewsletter();

const runtimeConfig = useRuntimeConfig();
const homepageCategoryId = runtimeConfig.public.homepageCategoryId;
if (typeof homepageCategoryId !== 'number') {
  await fetchPageTemplateLocal();
}
</script>
