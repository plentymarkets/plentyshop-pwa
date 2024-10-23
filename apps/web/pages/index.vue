<template>
  <UiHeroCarousel :hero-item-props="formattedHeroItems" />

  <NuxtLazyHydrate when-visible>
    <div class="max-w-screen-3xl mx-auto md:px-6 lg:px-10 mb-10">
      <UiMediaCard
        v-for="(item, index) in mediaData"
        :key="index"
        :image="item.image"
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
</template>

<script lang="ts" setup>
import { HeroItem } from '~/components/ui/HeroCarousel/types';
import { MediaItem } from '~/components/ui/MediaCard/types';
const viewport = useViewport();
const { t } = useI18n();
const { data: categoryTree } = useCategoryTree();
const recommendedProductsCategoryId = ref('');
definePageMeta({ pageType: 'static' });

const getDefaultHomepageTemplate = {
  id: 100,
  hero: [
    {
      image: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/homepage-hero-headphones.avif',
      tagline: 'Feel the music',
      heading: 'Your Sound, Elevated',
      description:
        "Immerse yourself in rich, crystal-clear audio with our cutting-edge headphones. Designed for the ultimate listening experience, whether you're a casual listener or an audiophile. Discover the perfect blend of style, comfort, and sound quality that elevates your music to new heights.\n" +
        '\n',
      callToAction: 'Order Now',
      link: '',
    },
    {
      image: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/homepage-hero-headphones.avif',
      tagline: 'Experience Sound Freedom',
      heading: 'Wireless. Effortless. Seamless.',
      description:
        'Unleash your audio with our state-of-the-art wireless earbuds. Designed for all-day comfort and uncompromised sound quality, these earbuds deliver crisp highs and deep bass, letting you enjoy your music without any distractions. Discover freedom with a perfect fit, long battery life, and intuitive controls.',
      callToAction: 'Shop Earbuds',
      link: '',
    },
    {
      image: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/homepage-hero-headphones.avif',
      tagline: 'Amplify Your Space',
      heading: 'Big Sound, Compact Design',
      description:
        "Transform your space with our portable speakers that pack a punch. Crafted for superior sound performance, these speakers are perfect for home or on the go. With easy connectivity and a sleek design, elevate your listening experience whether you're indoors or outdoors.",
      callToAction: 'Browse Speakers',
      link: '',
    },
  ],
  valueProposition: [
    {
      text: "<div class='flex flex-col mt-5 sm:mt-20 mt-0 sm:p-0 p-5 text-center sm:text-left'><span class='text-xl font-bold mb-2'>Experience the Future of Sound</span><h2 class='text-2xl font-semibold mb-4'>Redefine Your Listening Experience</h2><p class='typography-text-sm md:typography-text-lg mb-6 padding-right-desktop'>Our latest collection of headphones is designed to deliver unparalleled audio precision, with deep bass, clear highs, and an immersive experience for every genre of music. Combining sleek design, comfort, and cutting-edge technology, these headphones are made for those who refuse to compromise on sound quality.</p><ul class='list-disc list-inside typography-text-sm md:typography-text-lg '><li>Premium, studio-quality sound</li><li>Comfortable fit for extended listening</li><li>Long-lasting battery life</li><li>Seamless wireless connectivity</li></ul></div>",
      image: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/headphones-mediacard.avif',
      alignment: 'left',
    },
  ],
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
const mediaData = ref(
  homepageTemplate.value.valueProposition.map((media: MediaItem) => ({
    image: media.image,
    text: media.text,
    alignment: media.alignment,
  })),
);

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
