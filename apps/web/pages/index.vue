<template>
  <Editor v-if="isEditing" />
  <div v-else class="content">
    <UiHeroCarousel :hero-item-props="formattedHeroItems" />

    <NuxtLazyHydrate when-visible>
      <div class="max-w-screen-3xl mx-auto md:px-6 lg:px-10 mb-10">
        <UiMediaCard
          v-for="(item, index) in mediaData"
          :key="index"
          :image="item.image"
          :alt="item.alt"
          :text="item.text"
          :alignment="item.alignment"
        />
      </div>
    </NuxtLazyHydrate>

    <div class="max-w-screen-3xl mx-auto md:px-6 lg:px-10 mb-10">
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
  </div>
</template>

<script lang="ts" setup async>
const isEditing = useEditor();
const { formattedHeroItems, mediaData, recommendedProductsCategories } = await useHomepageData();
definePageMeta({ pageType: 'static', middleware: ['newsletter-confirmation'] });

const { showNewsletter } = useNewsletter();
</script>
