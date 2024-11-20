<template>
  <Editor v-if="isEditing" />
  <div v-else class="content">
    <div class="flex items-center justify-center h-full mt-5">
      <SfLoaderCircular v-if="loading" class="animate-spin" size="4xl" />
    </div>
    <UiHeroCarousel v-if="loadComponents" :hero-item-props="hero" />

    <NuxtLazyHydrate when-visible>
      <div v-if="loadComponents" class="max-w-screen-3xl mx-auto md:px-6 lg:px-10 mb-10">
        <UiMediaCard
          v-for="(item, index) in valueProposition"
          :key="index"
          :image="item.image"
          :alt="item.alt"
          :text="item.text"
          :alignment="item.alignment"
        />
      </div>
    </NuxtLazyHydrate>
    <div v-if="loadComponents" class="max-w-screen-3xl mx-auto md:px-6 lg:px-10 mb-10">
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
import { SfLoaderCircular } from '@storefront-ui/vue';
const { isEditing } = useEditor();
const { hero, valueProposition, fetchPageTemplate, recommendedProductsCategories } = useHomepage();
definePageMeta({ pageType: 'static', middleware: ['newsletter-confirmation'] });
const { showNewsletter } = useNewsletter();
const { loading } = useHomepage();

const loadComponents = ref(false);
onMounted(async () => {
  await fetchPageTemplate();
  loadComponents.value = true;
});
</script>
