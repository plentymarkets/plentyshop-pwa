<template>
  <Editor v-if="isEditing" />
  <div v-else class="content">
    <UiHeroCarousel :hero-item-props="hero" />

    <NuxtLazyHydrate when-visible>
      <div class="max-w-screen-3xl mx-auto md:px-6 lg:px-10 mb-10">
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

    <!-- <div>
      <h1>Content</h1>
      {{ data }}
    </div> -->

    <div class="max-w-screen-3xl mx-auto md:px-6 lg:px-10 mb-10">
      <NuxtLazyHydrate when-visible>
        <section class="mb-10 overflow-hidden">
          <p data-testid="recommended-products" class="mb-4 typography-text-lg text-center md:text-left">
            {{ t('moreItemsOfThisCategory') }}
          </p>
          <ProductRecommendedProducts cache-key="homepage" :category-id="recommendedProductsCategoryId" />
        </section>
      </NuxtLazyHydrate>
      <NuxtLazyHydrate when-visible>
        <NewsletterSubscribe v-if="showNewsletter" />
      </NuxtLazyHydrate>
    </div>
  </div>
</template>

<script lang="ts" setup async>
const { isEditing } = useEditor();

const { recommendedProductsCategoryId } = await useHomepageData();
const { hero, valueProposition, fetchData } = useHomePageState();
definePageMeta({ pageType: 'static' });
const { showNewsletter } = useNewsletter();
const { t } = useI18n();

onMounted(async () => {
  await fetchData();
  // console.log(data);
});
</script>
