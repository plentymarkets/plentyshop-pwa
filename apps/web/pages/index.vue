<template>
  <div class="relative min-h-[600px]">
    <UiHeroCarousel :head-phones="headPhones" :background="background" :items="heroItems"></UiHeroCarousel>
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
import { HeroItem } from '~/components/ui/HeroCarousel/types';

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
const heroItems: HeroItem[] = [
  {
    subtitle: 'New Wireless Pro',
    title: 'New Wireless Pro',
    description: 'Spatial audio. Adjustable ear cups. On-device controls. All-day battery.',
    primaryButtonLink: '',
    primaryButtonText: 'Order now',
    image: `/images/${viewport.breakpoint.value}/homepage-hero-headphones.avif`,
    backgroundSizes: {
      lg: { width: '4000', height: '600' },
      md: { width: '1024', height: '600' },
      sm: { width: '640', height: '752' },
    },
  },
  {
    subtitle: 'This is a demo subtitle',
    title: 'This is a demo title',
    description: 'Imagine a description here',
    primaryButtonLink: '',
    primaryButtonText: 'Order now',
    image: `/images/${viewport.breakpoint.value}/homepage-hero-headphones.avif`,
    backgroundSizes: {
      lg: { width: '4000', height: '600' },
      md: { width: '1024', height: '600' },
      sm: { width: '640', height: '752' },
    },
  },
  {
    subtitle: 'This is a demo subtitle',
    title: 'This is a demo title',
    description: 'Imagine a description here',
    primaryButtonLink: '',
    primaryButtonText: 'Order now',
    image: `/images/${viewport.breakpoint.value}/homepage-hero-headphones.avif`,
    backgroundSizes: {
      lg: { width: '4000', height: '600' },
      md: { width: '1024', height: '600' },
      sm: { width: '640', height: '752' },
    },
  },
  {
    subtitle: 'This is a demo subtitle',
    title: 'This is a demo title',
    description: 'Imagine a description here',
    primaryButtonLink: '',
    primaryButtonText: 'Order now',
    image: `/images/${viewport.breakpoint.value}/homepage-hero-headphones.avif`,
    backgroundSizes: {
      lg: { width: '4000', height: '600' },
      md: { width: '1024', height: '600' },
      sm: { width: '640', height: '752' },
    },
  },
  {
    subtitle: 'This is a demo subtitle',
    title: 'This is a demo title',
    description: 'Imagine a description here',
    primaryButtonLink: '',
    primaryButtonText: 'Order now',
    image: `/images/${viewport.breakpoint.value}/homepage-hero-headphones.avif`,
    backgroundSizes: {
      lg: { width: '4000', height: '600' },
      md: { width: '1024', height: '600' },
      sm: { width: '640', height: '752' },
    },
  },
  {
    subtitle: 'This is a demo subtitle',
    title: 'This is a demo title',
    description: 'Imagine a description here',
    primaryButtonLink: '',
    primaryButtonText: 'Order now',
    image: `/images/${viewport.breakpoint.value}/homepage-hero-headphones.avif`,
    backgroundSizes: {
      lg: { width: '4000', height: '600' },
      md: { width: '1024', height: '600' },
      sm: { width: '640', height: '752' },
    },
  },
  {
    subtitle: 'This is a demo subtitle',
    title: 'This is a demo title',
    description: 'Imagine a description here',
    primaryButtonLink: '',
    primaryButtonText: 'Order now',
    image: `/images/${viewport.breakpoint.value}/homepage-hero-headphones.avif`,
    backgroundSizes: {
      lg: { width: '4000', height: '600' },
      md: { width: '1024', height: '600' },
      sm: { width: '640', height: '752' },
    },
  },
  {
    subtitle: 'This is a demo subtitle',
    title: 'This is a demo title',
    description: 'Imagine a description here',
    primaryButtonLink: '',
    primaryButtonText: 'Order now',
    image: `/images/${viewport.breakpoint.value}/homepage-hero-headphones.avif`,
    backgroundSizes: {
      lg: { width: '4000', height: '600' },
      md: { width: '1024', height: '600' },
      sm: { width: '640', height: '752' },
    },
  },
  {
    subtitle: 'This is a demo subtitle',
    title: 'This is a demo title',
    description: 'Imagine a description here',
    primaryButtonLink: '',
    primaryButtonText: 'Order now',
    image: `/images/${viewport.breakpoint.value}/homepage-hero-headphones.avif`,
    backgroundSizes: {
      lg: { width: '4000', height: '600' },
      md: { width: '1024', height: '600' },
      sm: { width: '640', height: '752' },
    },
  },
  {
    subtitle: 'This is a demo subtitle',
    title: 'This is a demo title',
    description: 'Imagine a description here',
    primaryButtonLink: '',
    primaryButtonText: 'Order now',
    image: `/images/${viewport.breakpoint.value}/homepage-hero-headphones.avif`,
    backgroundSizes: {
      lg: { width: '4000', height: '600' },
      md: { width: '1024', height: '600' },
      sm: { width: '640', height: '752' },
    },
  },
  {
    subtitle: 'This is a demo subtitle',
    title: 'This is a demo title',
    description: 'Imagine a description here',
    primaryButtonLink: '',
    primaryButtonText: 'Order now',
    image: `/images/${viewport.breakpoint.value}/homepage-hero-headphones.avif`,
    backgroundSizes: {
      lg: { width: '4000', height: '600' },
      md: { width: '1024', height: '600' },
      sm: { width: '640', height: '752' },
    },
  },
  {
    subtitle: 'This is a demo subtitle',
    title: 'This is a demo title',
    description: 'Imagine a description here',
    primaryButtonLink: '',
    primaryButtonText: 'Order now',
    image: `/images/${viewport.breakpoint.value}/homepage-hero-headphones.avif`,
    backgroundSizes: {
      lg: { width: '4000', height: '600' },
      md: { width: '1024', height: '600' },
      sm: { width: '640', height: '752' },
    },
  },
];
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
