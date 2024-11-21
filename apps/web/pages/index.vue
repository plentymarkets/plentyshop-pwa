<template>
  <Editor v-if="isEditing" />
  <div v-else class="content">
    <div v-if="loadComponents" class="max-w-screen-3xl mx-auto md:px-6 lg:px-10 mb-10">
      <UiHeroCarousel :hero-item-props="hero" />
    </div>
    <div v-else class="max-w-screen-3xl mx-auto md:px-6 lg:px-10 mb-10">
      <UiSkeletonLoader />
    </div>

    <NuxtLazyHydrate when-visible>
      <div v-if="loadComponents" class="max-w-screen-3xl mx-auto md:px-6 lg:px-10 mb-10">
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

    <div v-if="loadComponents" class="max-w-screen-3xl mx-auto md:px-6 lg:px-10 mb-10">
      <template v-for="(item, index) in recommendedProductsCategories" :key="index">
        <section class="mb-10 overflow-hidden">
          <p data-testid="recommended-products" class="mb-4 typography-text-lg text-center md:text-left">
            {{ item.headline }}
          </p>
          <ProductRecommendedProducts
            cache-key="homepage"
            :category-id="item.categoryId"
            @data-fetched="onDataFetched"
          />
        </section>
      </template>
      <NuxtLazyHydrate when-visible>
        <NewsletterSubscribe v-if="showNewsletter" />
      </NuxtLazyHydrate>
    </div>
    <div v-else class="max-w-screen-3xl mx-auto md:px-6 lg:px-10 mb-10">
      <UiSkeletonLoader />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useNewsletter } from '~/composables/useNewsletter';

const { isEditing } = useEditor();
const { hero, mediaCard, fetchPageTemplate, recommendedProductsCategories } = useHomepage();
const { showNewsletter } = useNewsletter();

const loadComponents = ref(false);
const dataFetchedPromises = ref<Promise<void>[]>([]);

definePageMeta({ pageType: 'static', middleware: ['newsletter-confirmation'] });

onMounted(async () => {
  try {
    console.log('Fetching page template...');
    await fetchPageTemplate();
    console.log('Page template fetched:', recommendedProductsCategories.value);

    // Wait for all data fetching promises to resolve
    await Promise.all(dataFetchedPromises.value);
    loadComponents.value = true;
  } catch (error) {
    console.error('Error fetching page template:', error);
  }
});

function onDataFetched() {
  console.log('Data fetched from ProductRecommendedProducts');
  dataFetchedPromises.value.push(Promise.resolve());
}
</script>
