<template>
  <div class="relative mb-10">
    <div class="absolute w-full h-full z-[-1]">
      <img
        :src="background.image"
        :width="getSizeForViewport(background.sizes).width"
        :height="getSizeForViewport(background.sizes).height"
        :alt="background.alt"
        class="absolute top-0 left-0 w-full h-full object-cover"
      />
    </div>
    <div
      class="md:flex md:flex-row-reverse md:justify-center max-w-[1536px] mx-auto md:min-h-[600px] mb-10 text-center"
    >
      <div class="flex flex-col md:basis-2/4 md:items-stretch md:overflow-hidden">
        <img
          :src="formattedHeroItems[0].image"
          :width="getSizeForViewport(headPhones.sizes).width"
          :height="getSizeForViewport(headPhones.sizes).height"
          :alt="headPhones.alt"
          class="h-full object-cover object-left"
        />
      </div>
      <div class="p-4 md:p-10 md:max-w-[768px] md:flex md:flex-col md:justify-center md:items-start md:basis-2/4">
        <p class="typography-text-xs md:typography-text-sm font-bold tracking-widest text-neutral-500 uppercase">
          {{ formattedHeroItems[0].tagline }}
        </p>
        <h1 class="typography-display-2 md:typography-display-1 md:leading-[67.5px] font-bold mt-2 mb-4">
          {{ formattedHeroItems[0].heading }}
        </h1>
        <p class="typography-text-base md:typography-text-lg">
          {{ formattedHeroItems[0].description }}
        </p>
      </div>
    </div>
  </div>
  <NuxtLazyHydrate when-visible>
    <div class="max-w-screen-3xl mx-auto md:px-6 lg:px-10 mb-10">
      <UiMediaCard :image="mediaData.image" :text="mediaData.text" />
    </div>
  </NuxtLazyHydrate>
  <div class="max-w-screen-3xl mx-auto md:px-6 lg:px-10 mb-10">
    <NuxtLazyHydrate when-visible>
      <section class="mb-10 overflow-hidden">
        <p data-testid="recommended-products" class="mb-4 typography-text-lg">
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

const headPhones = {
  image: `/images/${viewport.breakpoint.value}/homepage-hero-headphones.avif`,
  alt: t('homepage.headPhones'),
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

const getDefaultHomepageTemplate = {
  id: 100,
  hero: [
    {
      image: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/homepage-hero-headphones.avif',
      tagline: 'Test',
      heading: 'Woohoo, this works',
      description: 'Description here',
      callToAction: 'click',
      link: '',
    },
    {
      image: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/pexels-chevanon-1108099.jpg',
      tagline: 'test slide 2',
      heading: 'new heading',
      description: 'imagine an description here',
      callToAction: 'click again',
      link: '',
    },
    {
      image: '',
      tagline: '',
      heading: '',
      description: '',
      callToAction: '',
      link: '',
    },
  ],
  valueProposition: {
    text: "<div class='flex flex-col mt-5 sm:mt-20 mt-0 sm:p-0 p-5 text-center sm:text-left'><span class='text-xl font-bold mb-2'>The new Pwa shop</span><h3 class='text-2xl font-semibold mb-4'>Text value for value proposition text</h3><p class='text-base mb-6'>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.</p><ul class='list-disc list-inside'><li>Lorem ipsum dolor sit amet</li><li>Consetetur sadipscing elitr</li><li>Sed diam nonumy eirmod tempor</li><li>At vero eos et accusam</li></ul></div>",
    image: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/doggos__1_.jpg',
  },
  featured: [
    {
      headline: '',
      categoryId: 1,
    },
    {
      headline: '',
      categoryId: 2,
    },
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

const mediaData = ref({
  image: homepageTemplate.value.valueProposition.image,
  text: homepageTemplate.value.valueProposition.text,
});

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
watch(
  () => categoryTree.value,
  async () => {
    const firstCategoryId = categoryTree.value?.[0]?.id;
    if (firstCategoryId) recommendedProductsCategoryId.value = firstCategoryId.toString();
  },
  { immediate: true },
);
const { showNewsletter } = useNewsletter();
export type Size = {
  width: string;
  height: string;
};

export type Sizes = {
  lg: Size;
  md: Size;
  sm: Size;
};

type SizeKey = keyof Sizes;

const getSizeForViewport = (sizes: Sizes | undefined): Size => {
  if (!sizes) return { width: '0', height: '0' };
  const breakpoint = viewport.breakpoint.value as SizeKey;

  return sizes[breakpoint] || { width: '0', height: '0' };
};
const background = {
  image: `/images/${viewport.breakpoint.value}/homepage-hero-bg.avif`,
  alt: t('homepage.background'),
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
