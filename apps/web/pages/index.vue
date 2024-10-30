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
import useHomepageData from '~/composables/useHomepageData/useHomepageData';
const { formattedHeroItems, mediaData, recommendedProductsCategoryId } = await useHomepageData();
definePageMeta({ pageType: 'static' });
const { showNewsletter } = useNewsletter();
const { t } = useI18n();
</script>
