<template>
  <div class="relative min-h-[600px]">
    <img
      :src="viewport.isLessThan('md') ? '/images/homepage-hero-bg-mobile.avif' : '/images/homepage-hero-bg.avif'"
      format="avif"
      height="412"
      width="605"
      alt="Hero background"
      class="absolute w-full h-full z-[-1] md:object-cover"
      loading="lazy"
    />
    <div class="md:flex md:flex-row-reverse md:justify-center max-w-[1536px] mx-auto md:min-h-[600px]">
      <div class="flex flex-col md:basis-2/4 md:items-stretch md:overflow-hidden">
        <img
          src="/images/homepage-hero-headphones.avif"
          format="avif"
          height="600"
          width="800"
          alt="Headphones"
          class="h-full object-cover object-left"
          loading="lazy"
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
          <SfButton size="lg"> {{ t('homepage.banner.orderNow') }}</SfButton>
          <SfButton size="lg" variant="secondary" class="bg-white"> {{ t('homepage.banner.showMore') }}</SfButton>
        </div>
      </div>
    </div>
  </div>
  <div class="max-w-screen-3xl mx-auto md:px-6 lg:px-10">
    <div class="flex flex-wrap gap-4 lg:gap-6 lg:flex-no-wrap justify-center my-10">
      <div
        v-for="{ title, image } in categories"
        :key="title"
        role="img"
        :aria-label="title"
        :aria-labelledby="`image-${title}`"
        class="relative flex-col min-w-[140px] max-w-[360px] justify-center group"
      >
        <img
          :src="image"
          :alt="title"
          format="avif"
          class="rounded-full bg-neutral-100 group-hover:shadow-xl group-active:shadow-none"
          width="360"
          height="360"
          loading="lazy"
        />
        <div :id="`image-${title}`" class="flex justify-center">
          <div
            class="mt-4 font-semibold no-underline text-normal-900 typography-text-base group-hover:text-primary-800 group-hover:font-normal group-active:text-primary-800 group-active:font-normal"
          >
            {{ title }}
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col md:flex-row flex-wrap gap-6 mt-max-w-[1540px]">
      <div
        v-for="{
          image,
          title,
          subtitle,
          description,
          buttonText,
          backgroundColor,
          reverse,
          titleClass,
          subtitleClass,
        } in displayDetails"
        :key="title"
        :class="[
          'relative flex md:max-w-[1536px] md:[&:not(:first-of-type)]:flex-1 md:first-of-type:w-full',
          backgroundColor,
        ]"
      >
        <a
          class="absolute w-full h-full z-1 focus-visible:outline focus-visible:rounded-lg"
          :aria-label="title"
          href="#"
        />
        <div :class="['flex justify-between overflow-hidden grow', { 'flex-row-reverse': reverse }]">
          <div class="flex flex-col justify-center items-start p-6 lg:p-10 max-w-1/2">
            <p :class="['uppercase typography-text-xs block font-bold tracking-widest', subtitleClass]">
              {{ subtitle }}
            </p>
            <h2 :class="['mb-4 mt-2 font-bold typography-display-3', titleClass]">
              {{ title }}
            </h2>
            <p class="typography-text-base block mb-4">
              {{ description }}
            </p>
            <SfButton class="!bg-black">{{ buttonText }}</SfButton>
          </div>
          <img
            :src="image"
            :alt="title"
            format="avif"
            width="50%"
            height="100%"
            class="self-end object-contain"
            loading="lazy"
          />
        </div>
      </div>
    </div>
    <NuxtLazyHydrate when-visible>
      <NewsletterSubscribe />
    </NuxtLazyHydrate>
    <NuxtLazyHydrate when-visible>
      <section class="mx-4 mt-28 mb-20 overflow-hidden">
        <p data-testid="recommended-products" class="my-4 typography-text-lg">
          {{ t('moreItemsOfThisCategory') }}
        </p>
        <ProductRecommendedProducts cache-key="homepage" :category-id="recommendedProductsCategoryId" />
      </section>
    </NuxtLazyHydrate>
  </div>
</template>

<script lang="ts" setup>
import { SfButton } from '@storefront-ui/vue';
const viewport = useViewport();
const { t } = useI18n();
definePageMeta({ pageType: 'static' });

const { data: categoryTree } = useCategoryTree();
const recommendedProductsCategoryId = ref('');

useHead({
  link: [
    {
      rel: 'preload',
      href: viewport.isLessThan('md') ? '/images/homepage-hero-bg-mobile.avif' : '/images/homepage-hero-bg.avif',
      as: 'image',
    },
    {
      rel: 'preload',
      href: '/images/homepage-hero-headphones.avif',
      as: 'image',
    },
  ],
});

watch(
  () => categoryTree.value,
  async () => {
    const firstCategoryId = categoryTree.value?.[0]?.id;
    if (firstCategoryId) recommendedProductsCategoryId.value = firstCategoryId.toString();
  },
  { immediate: true },
);

const displayDetails = [
  {
    image: '/images/homepage-display-1.avif',
    title: t('homepage.displayDetails.detail1.title'),
    subtitle: t('homepage.displayDetails.detail1.subtitle'),
    description: t('homepage.displayDetails.detail1.description'),
    buttonText: t('homepage.displayDetails.detail1.buttonText'),
    reverse: false,
    backgroundColor: 'bg-negative-200',
    titleClass: 'md:typography-display-2',
    subtitleClass: 'md:typography-headline-6',
    descriptionClass: 'md:typography-text-lg',
  },
  {
    image: '/images/homepage-display-2.avif',
    title: t('homepage.displayDetails.detail2.title'),
    subtitle: t('homepage.displayDetails.detail2.subtitle'),
    description: t('homepage.displayDetails.detail2.description'),
    buttonText: t('homepage.displayDetails.detail2.buttonText'),
    reverse: true,
    backgroundColor: 'bg-warning-200',
  },
  {
    image: '/images/homepage-display-3.avif',
    title: t('homepage.displayDetails.detail3.title'),
    subtitle: t('homepage.displayDetails.detail3.subtitle'),
    description: t('homepage.displayDetails.detail3.description'),
    buttonText: t('homepage.displayDetails.detail3.buttonText'),
    reverse: false,
    backgroundColor: 'bg-secondary-200',
  },
];

const categories = [
  {
    title: t('homepage.women'),
    image: '/images/homepage-women-category.avif',
  },
  {
    title: t('homepage.men'),
    image: '/images/homepage-men-category.avif',
  },
  {
    title: t('homepage.kid'),
    image: '/images/homepage-kid-category.avif',
  },
];
</script>
