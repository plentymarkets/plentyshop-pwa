<template>
  <Editor v-if="isEditing" />
  <div v-else class="content">
    <div class="flex items-center justify-center h-full mt-5">
      <SfLoaderCircular v-if="!heroLoaded" class="animate-spin" size="4xl" />
    </div>
    <UiHeroCarousel v-if="heroLoaded" :hero-item-props="hero" />

    <NuxtLazyHydrate when-visible>
      <div v-if="media" class="max-w-screen-3xl mx-auto md:px-6 lg:px-10 mb-10">
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
import { SfLoaderCircular } from '@storefront-ui/vue';
const { isEditing } = useEditor();
const { hero, valueProposition, fetchData, recommendedProductsCategories } = useHomePageState();
definePageMeta({ pageType: 'static', middleware: ['newsletter-confirmation'] });
const { showNewsletter } = useNewsletter();

const heroLoaded = ref(false);
const media = ref(false);
onMounted(async () => {
  await fetchData();
  heroLoaded.value = true;
  media.value = true;
});
</script>
