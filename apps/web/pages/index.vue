<template>
  <div class="relative min-h-[600px]">
    <div class="absolute w-full h-full z-[-1]">
      <img
        :src="background.image"
        :width="getSizeForViewport(background.sizes).width"
        :height="getSizeForViewport(background.sizes).height"
        alt="Hero background"
        class="absolute top-0 left-0 w-full h-full object-cover"
      />
    </div>
    <div class="md:flex md:flex-row-reverse md:justify-center max-w-[1536px] mx-auto md:min-h-[600px]">
      <div class="flex flex-col md:basis-2/4 md:items-stretch md:overflow-hidden">
        <img
          :src="headPhones.image"
          :width="getSizeForViewport(headPhones.sizes).width"
          :height="getSizeForViewport(headPhones.sizes).height"
          alt="Headphones"
          class="h-full object-cover object-left"
        />
      </div>
      <div class="p-4 md:p-10 md:max-w-[768px] md:flex md:flex-col md:justify-center md:items-start md:basis-2/4">
        <p class="typography-text-xs md:typography-text-sm font-bold tracking-widest text-neutral-500 uppercase">
          {{ t('homepage.banner.moto1') }}
        </p>
        <h1 class="typography-display-2 md:typography-display-1 md:leading-[67.5px] font-bold mt-2 mb-4">
          {{ t('homepage.banner.moto2') }}
        </h1>
        <p class="typography-text-base md:typography-text-lg">
          {{ t('homepage.banner.moto3') }}
        </p>
        <div class="flex flex-col md:flex-row gap-4 mt-6">
          <UiButton size="lg"> {{ t('homepage.banner.orderNow') }}</UiButton>
          <UiButton size="lg" variant="secondary" class="bg-white"> {{ t('homepage.banner.showMore') }}</UiButton>
        </div>
      </div>
    </div>
  </div>
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
      <NewsletterSubscribe />
    </NuxtLazyHydrate>
    <UiMediaCard :image="mediaData.image" :text="mediaData.text" />
  </div>
</template>

<script lang="ts" setup>
const viewport = useViewport();
const { t } = useI18n();
const { data: categoryTree } = useCategoryTree();
const recommendedProductsCategoryId = ref('');
definePageMeta({ pageType: 'static' });

const getDefaultHomepageTemplate = {
  id: 100,
  hero: [
    { image: '', tagline: '', heading: '', description: '', callToAction: '', link: '' },
    { image: '', tagline: '', heading: '', description: '', callToAction: '', link: '' },
    { image: '', tagline: '', heading: '', description: '', callToAction: '', link: '' },
  ],
  valueProposition: { text: '', image: '' },
  featured: [
    { headline: '', categoryId: 1 },
    { headline: '', categoryId: 2 },
  ],
};

const runtimeConfig = useRuntimeConfig();
const homepageTemplate = ref(JSON.stringify(getDefaultHomepageTemplate));
const homepageCategoryId = runtimeConfig.public.homepageCategoryId;
const { fetchCategoryTemplate } = useCategoryTemplate();
if (typeof homepageCategoryId === 'number') {
  const { data } = await fetchCategoryTemplate(runtimeConfig.public.homepageCategoryId);
  homepageTemplate.value = data;
}

type Size = {
  width: string;
  height: string;
};
type Sizes = {
  lg: Size;
  md: Size;
  sm: Size;
};
type SizeKey = keyof Sizes;

const getSizeForViewport = (sizes: Sizes) => {
  const breakpoint = viewport.breakpoint.value as SizeKey;
  return sizes[breakpoint];
};

const mediaData = ref({
  image: 'https://placehold.co/600x400',
  text: '<h4>Lorem Ipsum Dolor</h4><p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p><ul><li>Test</li></ul>',
});

watch(
  () => categoryTree.value,
  async () => {
    const firstCategoryId = categoryTree.value?.[0]?.id;
    if (firstCategoryId) recommendedProductsCategoryId.value = firstCategoryId.toString();
  },
  { immediate: true },
);

const headPhones = {
  image: `/images/${viewport.breakpoint.value}/homepage-hero-headphones.avif`,
  sizes: {
    lg: {
      width: '800',
      height: '600',
    },
    md: {
      width: '800',
      height: '600',
    },
    sm: {
      width: '640',
      height: '480',
    },
  },
};
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
    {
      rel: 'preload',
      href: headPhones.image,
      as: 'image',
    },
  ],
});
</script>
