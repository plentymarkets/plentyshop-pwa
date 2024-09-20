<template>
  <div class="relative min-h-[600px]">
    <UiHeroCarousel :background="background" :hero="formattedHeroItems"></UiHeroCarousel>
  </div>
  <NuxtLazyHydrate when-visible>
    <div class="max-w-screen-3xl mx-auto md:px-6 lg:px-10">
      <UiMediaCard :image="mediaData.image" :text="mediaData.text" />
    </div>
  </NuxtLazyHydrate>
  <div class="max-w-screen-3xl mx-auto md:px-6 lg:px-10">
    <NuxtLazyHydrate when-visible>
      <section class="mx-4 mt-28 mb-20 overflow-hidden">
        <p data-testid="recommended-products" class="my-4 typography-text-lg">
          {{ t('moreItemsOfThisCategory') }}
        </p>
        <ProductRecommendedProducts cache-key="homepage" :category-id="recommendedProductsCategoryId" />
      </section>
    </NuxtLazyHydrate>
    <NuxtLazyHydrate when-visible>
      <NewsletterSubscribe v-if="showNewsletter" />
    </NuxtLazyHydrate>
  </div>
</template>

<script lang="ts" setup>
import { HeroItem } from '~/components/ui/HeroCarousel/types';

const viewport = useViewport();
const { t } = useI18n();
const { data: categoryTree } = useCategoryTree();
const recommendedProductsCategoryId = ref('');
definePageMeta({ pageType: 'static' });

const getDefaultHomepageTemplate = {
  id: 100,
  hero: [
    { image: `/images/${viewport.breakpoint.value}/homepage-hero-headphones.avif`, tagline: t('homepage.banner.moto1'), heading: t('homepage.banner.moto2'), description: t('homepage.banner.moto3'), callToAction: t('homepage.banner.orderNow'), link: '' },
  ],
  valueProposition: { text: '', image: '' },
  featured: [
    { headline: '', categoryId: 1 },
    { headline: '', categoryId: 2 },
  ],
};

const runtimeConfig = useRuntimeConfig();
const homepageTemplate = ref<typeof getDefaultHomepageTemplate>(getDefaultHomepageTemplate);
const homepageCategoryId = runtimeConfig.public.homepageCategoryId;
const { fetchCategoryTemplate } = useCategoryTemplate();
if (typeof homepageCategoryId === 'number') {
  const { data } = await fetchCategoryTemplate(homepageCategoryId);
  const parsedData = JSON.parse(data);
  if (parsedData) {
    homepageTemplate.value = {
      id: parsedData.id,
      hero: parsedData.hero || [],
      valueProposition: parsedData.valueProposition,
      featured: parsedData.featured,
    };
  }
}

const formattedHeroItems = ref<HeroItem[]>(
  homepageTemplate.value.hero.map((item) => ({
    image: item.image,
    tagline: item.tagline,
    heading: item.heading,
    description: item.description,
    callToAction: item.callToAction,
    link: item.link,
    backgroundSizes: {
      lg: { width: '4000', height: '600' },
      md: { width: '1024', height: '600' },
      sm: { width: '640', height: '752' },
    },
  })),
);
const mediaData = ref({
  image: homepageTemplate.value.valueProposition.image,
  text: homepageTemplate.value.valueProposition.text,
});
watch(
  () => categoryTree.value,
  async () => {
    const firstCategoryId = categoryTree.value?.[0]?.id;
    if (firstCategoryId) recommendedProductsCategoryId.value = firstCategoryId.toString();
  },
  { immediate: true },
);
const { showNewsletter } = useNewsletter();

const background = {
  image: `/images/${viewport.breakpoint.value}/homepage-hero-bg.avif`,
  sizes: {
    lg: {
      width: '4000',
      height: '600',
    },
    md: {
      width: '1024',
      height: '600',
    },
    sm: {
      width: '640',
      height: '752',
    },
  },
};

useHead({
  link: [
    {
      rel: 'preload',
      href: background.image,
      as: 'image',
    },
  ],
});
</script>
