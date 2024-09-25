<template>
  <div class="relative mb-5 md:mb-20">
    <!-- <UiHeroCarousel :background="background" :hero="formattedHeroItems"></UiHeroCarousel> -->
    <UiGalleryScrollable :background="background" :hero="formattedHeroItems" />
    <!-- <div class="relative max-h-[600px] flex flex-col w-full aspect-[4/3] gap-1">
      <SfScrollable
        class="w-full h-full snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        :active-index="activeIndex"
        wrapper-class="h-full group/scrollable"
        is-active-index-centered
        :previous-disabled="activeIndex === 0"
        :next-disabled="activeIndex === hero.length - 1"
        buttons-placement="block"
        @on-prev="activeIndex -= 1"
        @on-next="activeIndex += 1"
      >
        <template #previousButton="defaultProps">
          <SfButton
            v-bind="defaultProps"
            :disabled="activeIndex === 0"
            class="absolute hidden group-hover/scrollable:block disabled:!hidden !rounded-full !p-3 z-10 top-1/2 left-4 bg-white"
            variant="secondary"
            size="lg"
            square
          >
            <SfIconChevronLeft />
          </SfButton>
        </template>

        <div
          v-for="(item, index) in getDefaultHomepageTemplate.hero"
          :key="index"
          class="carousel-div relative min-h-[600px] flex justify-center basis-full snap-center snap-always shrink-0 grow"
        >
          <div class="absolute w-full h-full z-[-1] overflow-hidden">
            <img
              :src="background.image"
              :width="getSizeForViewport(background.sizes).width"
              :height="getSizeForViewport(background.sizes).height"
              :alt="item.heading"
              class="absolute top-0 left-0 w-full h-full object-cover"
            />
          </div>
          <div class="md:flex md:flex-row-reverse md:justify-center max-w-[1536px] mx-auto md:min-h-[600px]">
            <div class="flex flex-col md:basis-2/4 md:items-stretch md:overflow-hidden">
              <img :src="item.image" :alt="item.heading" class="h-full object-cover object-left" />
            </div>
            <div class="p-4 md:p-10 md:max-w-[768px] md:flex md:flex-col md:justify-center md:items-start md:basis-2/4">
              <p class="typography-text-xs md:typography-text-sm font-bold tracking-widest text-neutral-500 uppercase">
                {{ item.tagline }}
              </p>
              <h1 class="typography-display-2 md:typography-display-1 md:leading-[67.5px] font-bold mt-2 mb-4">
                {{ item.heading }}
              </h1>
              <p class="typography-text-base md:typography-text-lg">
                {{ item.description }}
              </p>
              <div class="flex flex-col md:flex-row gap-4 mt-6">
                <UiButton size="lg"> {{ item.callToAction }} </UiButton>
              </div>
            </div>
          </div>
        </div>

        <template #nextButton="defaultProps">
          <SfButton
            v-bind="defaultProps"
            :disabled="activeIndex === hero.length - 1"
            class="absolute hidden group-hover/scrollable:block disabled:!hidden !rounded-full !p-3 z-10 top-1/2 right-4 bg-white"
            variant="secondary"
            size="lg"
            square
          >
            <SfIconChevronRight />
          </SfButton>
        </template>
      </SfScrollable>
      <div class="flex-shrink-0 basis-auto">
        <div
          class="flex-row w-full flex gap-0.5 mt justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] md:hidden"
        >
          <button
            v-for="index in hero.length"
            :key="`${index}-bullet`"
            :aria-current="activeIndex === index - 1"
            :aria-label="'Slide ' + index"
            :class="[
              'mx-2 w-4 h-4 rounded-full mt-1 border-4 transition-colors focus-visible:outline focus-visible:outline-offset-0 pointer-events-none',
              activeIndex === index - 1 ? 'border-primary-700 bg-primary-700' : 'border-gray-200 bg-gray-200',
            ]"
            @click="activeIndex = index - 1"
            @scroll="activeIndex = index - 1"
          />
        </div>
      </div>
    </div> -->
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
// import { HeroItem } from '~/components/ui/HeroCarousel/types';
import { useCategoryTemplate } from '~/composables';

const viewport = useViewport();
const { t } = useI18n();
const { data: categoryTree } = useCategoryTree();
const recommendedProductsCategoryId = ref('');
definePageMeta({ pageType: 'static' });

interface HeroItem {
  image: string;
  tagline: string;
  heading: string;
  description: string;
  callToAction: string;
  link: string;
}

interface CategoryTemplate {
  id: number;
  hero: HeroItem[];
  valueProposition: {
    text: string;
    image: string;
  };
  featured: {
    headline: string;
    categoryId: number;
  }[];
}

interface Background {
  image: string;
  sizes: {
    lg: {
      width: string;
      height: string;
    };
    md: {
      width: string;
      height: string;
    };
    sm: {
      width: string;
      height: string;
    };
  };
}
const props = defineProps({
  hero: {
    type: Array as PropType<HeroItem[]>,
    required: true,
    default: () => [],
  },
  background: {
    type: Object as PropType<Background>,
    required: true,
  },
});
const activeIndex = ref(0);

const getDefaultHomepageTemplate = {
  id: 100,
  hero: [
    {
      image: `/images/${viewport.breakpoint.value}/homepage-hero-headphones.avif`,
      tagline: t('homepage.banner.moto1'),
      heading: t('homepage.banner.moto2'),
      description: t('homepage.banner.moto3'),
      callToAction: t('homepage.banner.orderNow'),
      link: '',
    },
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
    text: "<div class='flex flex-col justify-center mt-5 sm:mt-20 mt-0 sm:p-0 p-5'><span class='text-xl font-bold mb-2'>The new Pwa shop</span><h3 class='text-2xl font-semibold mb-4'>Text value for value proposition text</h3><p class='text-base mb-6'>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.</p><ul class='list-disc list-inside'><li>Lorem ipsum dolor sit amet</li><li>Consetetur sadipscing elitr</li><li>Sed diam nonumy eirmod tempor</li><li>At vero eos et accusam</li></ul></div>",
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
  const parsedData: CategoryTemplate = JSON.parse(data);
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
