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
            class="mt-4 font-semibold no-underline text-normal-900 typography-text-base group-hover:text-primary-800 group-active:text-primary-800"
          >
            {{ title }}
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col md:flex-row flex-wrap gap-6 mt-max-w-[1540px]">
      <div
        v-for="details in displayDetails"
        :key="details.title"
        :class="[
          'relative flex md:max-w-[1536px] md:[&:not(:first-of-type)]:flex-1 md:first-of-type:w-full',
          details.backgroundColor,
        ]"
      >
        <div :class="['flex justify-between overflow-hidden grow', { 'flex-row-reverse': details.reverse }]">
          <div class="flex flex-col justify-center items-start p-6 lg:p-10 max-w-1/2">
            <p :class="['uppercase typography-text-xs block font-bold tracking-widest', details.subtitleClass]">
              {{ details.subtitle }}
            </p>
            <h2 :class="['mb-4 mt-2 font-bold typography-display-3', details.titleClass]">
              {{ details.title }}
            </h2>
            <p class="typography-text-base block mb-4">
              {{ details.description }}
            </p>
            <NuxtLink to="/">
              <SfButton class="!bg-black hover:!bg-white hover:!text-black">{{ details.buttonText }}</SfButton>
            </NuxtLink>
          </div>
          <img
            :src="details.image"
            :alt="details.title"
            :width="getSizeForViewport(details.sizes).width"
            :height="getSizeForViewport(details.sizes).height"
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
const { data: categoryTree } = useCategoryTree();
const recommendedProductsCategoryId = ref('');
definePageMeta({ pageType: 'static' });

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

watch(
  () => categoryTree.value,
  async () => {
    const firstCategoryId = categoryTree.value?.[0]?.id;
    if (firstCategoryId) recommendedProductsCategoryId.value = firstCategoryId.toString();
  },
  { immediate: true },
);
const displayDetails = computed(() => {
  return [
    {
      image: `/images/${viewport.breakpoint.value}/homepage-display-1.avif`,
      title: t('homepage.displayDetails.detail1.title'),
      subtitle: t('homepage.displayDetails.detail1.subtitle'),
      description: t('homepage.displayDetails.detail1.description'),
      buttonText: t('homepage.displayDetails.detail1.buttonText'),
      reverse: false,
      backgroundColor: 'bg-negative-200',
      titleClass: 'md:typography-display-2',
      subtitleClass: 'md:typography-headline-6',
      descriptionClass: 'md:typography-text-lg',
      sizes: {
        lg: {
          width: '728',
          height: '728',
        },
        md: {
          width: '488',
          height: '488',
        },
        sm: {
          width: '320',
          height: '320',
        },
      },
    },
    {
      image: `/images/${viewport.breakpoint.value}/homepage-display-2.avif`,
      title: t('homepage.displayDetails.detail2.title'),
      subtitle: t('homepage.displayDetails.detail2.subtitle'),
      description: t('homepage.displayDetails.detail2.description'),
      buttonText: t('homepage.displayDetails.detail2.buttonText'),
      reverse: true,
      backgroundColor: 'bg-warning-200',
      sizes: {
        lg: {
          width: '358',
          height: '358',
        },
        md: {
          width: '472',
          height: '472',
        },
        sm: {
          width: '320',
          height: '320',
        },
      },
    },
    {
      image: `/images/${viewport.breakpoint.value}/homepage-display-3.avif`,
      title: t('homepage.displayDetails.detail3.title'),
      subtitle: t('homepage.displayDetails.detail3.subtitle'),
      description: t('homepage.displayDetails.detail3.description'),
      buttonText: t('homepage.displayDetails.detail3.buttonText'),
      reverse: false,
      backgroundColor: 'bg-secondary-200',
      sizes: {
        lg: {
          width: '358',
          height: '358',
        },
        md: {
          width: '238',
          height: '238',
        },
        sm: {
          width: '320',
          height: '320',
        },
      },
    },
  ];
});
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
