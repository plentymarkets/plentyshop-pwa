<template>
  <!-- CHANGED -->
  <div class="relative min-h-[400px] md:min-h-[1000px]">
    <picture>
      <source srcset="/images/home_damen_herren.webp" media="(min-width: 768px)" />
      <img
        src="/images/home_damen_herren.jpg"
        height="412"
        width="605"
        alt="Hero mobile background"
        class="absolute w-full h-full z-[-1] object-cover"
      />
    </picture>
    <div class="flex items-end max-w[1536px] mx-auto min-h-[400px] md:min-h-[1000px] justify-center">
      <!--<div class="flex flex-col md:basis-2/4 md:items-stretch md:overflow-hidden">
        <img
          src="/images/homepage-hero-headphones.webp"
          height="600"
          width="800"
          alt="Headphones"
          class="h-full object-cover object-left"
        />
      </div>-->
      <div class="flex gap-8 pb-[5%]">
        <SfButton size="lg" class="bg-white/60 text-primary-900 !rounded-none min-w-[200px] uppercase">
          {{ t('homepage.banner.orderNow') }}</SfButton
        >
        <SfButton size="lg" class="bg-white/60 text-primary-900 !rounded-none min-w-[200px] uppercase">
          {{ t('homepage.banner.showMore') }}</SfButton
        >
      </div>
      <!--
      <div class="p-4 md:p-10 md:max-w-[1200px] md:flex md:flex-col md:justify-center md:items-start md:basis-2/4">
        <p class="typography-text-xs md:typography-text-sm font-bold tracking-widest text-neutral-500 uppercase">
          {{ t('homepage.banner.moto1') }}
        </p>
        <h1 class="typography-display-2 md:typography-display-1 md:leading-[67.5px] font-bold mt-2 mb-4">
          {{ t('homepage.banner.moto2') }}
        </h1>
        <p class="typography-text-base md:typography-text-lg">
          {{ t('homepage.banner.moto3') }}
        </p>
        <div class="flex w-full gap-4 mt-6">
          <SfButton size="lg"> {{ t('homepage.banner.orderNow') }}</SfButton>
          <SfButton size="lg" variant="secondary" class="bg-white"> {{ t('homepage.banner.showMore') }}</SfButton>
        </div>
      </div>-->
    </div>
  </div>
  <div class="max-w-screen-3xl mx-auto text-center">
    <Splide :options="werteSlider" aria-labelledby="Unsere Werte" class="px-4 md:px-0">
      <SplideSlide v-for="werte in werteData">
          <div class="werte-item">
            <img :src="werte.icon" class="max-h-16 max-w-60 w-full inline-block" :alt="werte.text" />
            <span class="block">{{ werte.text }}</span> 
          </div>
      </SplideSlide>
    </Splide>
    <Splide :options="testimonialSlider" aria-labelledby="Kundenmeinungen" class="px-4 md:px-0">
      <SplideSlide v-for="testimonial in testimonialsData">
        <div class="max-w-screen-xl px-4 py-8 mx-auto text-center lg:py-16 lg:px-6">
          <figure class="max-w-screen-md mx-auto">
              <svg class="h-12 mx-auto mb-3 text-gray-400 dark:text-gray-600" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" fill="currentColor"/>
              </svg> 
              <blockquote>
                  <p class="text-2xl font-medium">"{{ testimonial.text }}"</p>
              </blockquote>
              <figcaption class="flex items-center justify-center mt-6 space-x-3">
                  <div class="flex items-center divide-x-2 divide-gray-500 dark:divide-gray-700">
                      <div class="pr-3 font-medium">{{ testimonial.name }}</div>
                      <div class="pl-3 text-sm font-light text-gray-500 dark:text-gray-400">Kunde</div>
                  </div>
              </figcaption>
          </figure>
      </div>
      </SplideSlide>
    </Splide>
  </div>

  <div class="max-w-screen-3xl mx-auto md:px-6 lg:px-10">
    <div class="grid grid-cols-12 gap-[30px]">
      <div class="brand-img col-span-6 lg:col-span-3 flex justify-center">
        <img src="/images/brands/stetson-logo-vector-svg.svg" class="max-h-16 max-w-60 w-full" />
      </div>
      <div class="brand-img col-span-6 lg:col-span-3 flex justify-center">
        <img src="/images/brands/Breiter-Logo-Webshop240x52.svg" class="max-h-16 max-w-60 w-full" />
      </div>
      <div class="brand-img col-span-6 lg:col-span-3 flex justify-center">
        <img src="/images/brands/Mayser_est_1800_Logo.svg" class="max-h-16 max-w-60 w-full" />
      </div>
      <div class="brand-img col-span-6 lg:col-span-3 flex justify-center">
        <img src="/images/brands/Logo_Borsalino_black.svg" class="max-h-16 max-w-60 w-full" />
      </div>
    </div>
  </div>
  <div class="max-w-screen-3xl mx-auto md:px-6 lg:px-10">
    <SplideProductSlider cache-key="homepage" :category-id="recommendedProductsCategoryId" />
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


const werteSlider = {
  fixedWidth: '220px',
  drag: 'free',
  mediaQuery: 'min',
  loop: false,
  arrows: false,
  pagination: false,
  gap: '30px',
  breakpoints: {
    768: {
      perPage: 3,
      fixedWidth: false,
      arrows: true,
    },
    992: {
      perPage: 5,
    },
  },
};
const werteData = [
  {
    "icon": "/images/werte/Werte_Tradition_mit_Herz_sw.svg",
    "text": "Traditon mit Herz"
  },
  {
    "icon": "/images/werte/Werte_5_Gernation_sw.svg",
    "text": "5. Generation familiengeführt"
  },
  {
    "icon": "/images/werte/Werte_Qualitataetshuete_sw.svg",
    "text": "Auserlesene Qualitätshüte"
  },
  {
    "icon": "/images/werte/Werte_Zufriedenheit_sw.svg",
    "text": "100% zufrieden oder Geld zurück"
  },
  {
    "icon": "/images/werte/Werte_Expertise_sw.svg",
    "text": "160 Jahre Expertise"
  }
];
const testimonialSlider = {
  perPage: 1,
  mediaQuery: 'min',
  loop: false,
  arrows: false,
  pagination: true,
  classes: {
		page: 'splide__pagination__page !bg-primary-700',
  }
};
const testimonialsData = [
  {
    "text": "Die Seite ist leicht bedienbar, Bestellvorgang angenehm im Handling. Lieferung erfolgte sehr zügig, daher absolut empfehlenswert!",
    "name": "Norbert S."
  },
  {
    "text": "Tolle Qualität des Panama-Hutes, superschnelle Lieferung - ich bin überaus zufrieden. Vielen herzlichen Dank!",
    "name": "Anna A."
  },
  {
    "text": "Das Produkt entspricht voll und ganz dem was online angeboten wird. Auch hier spiegelt sich die Professionalität eines langjährigen Traditionsunternehmens wieder.",
    "name": "Peter K."
  }
]
</script>
