<template>
  <div class="relative min-h-[600px]">
    <picture>
      <source
        srcset="https://storage.googleapis.com/sfui_docs_artifacts_bucket_public/production/hero-bg.png"
        media="(min-width: 768px)"
      />
      <img
        src="https://storage.googleapis.com/sfui_docs_artifacts_bucket_public/production/hero-bg-mobile.png"
        class="absolute w-full h-full z-[-1] md:object-cover"
      />
    </picture>
    <div class="md:flex md:flex-row-reverse md:justify-center max-w[1536px] mx-auto md:min-h-[600px]">
      <div class="flex flex-col md:basis-2/4 md:items-stretch md:overflow-hidden">
        <img
          src="https://storage.googleapis.com/sfui_docs_artifacts_bucket_public/production/hero-headphones.png"
          alt="Headphones"
          class="h-full object-cover object-left"
        />
      </div>
      <div class="p-4 md:p-10 md:max-w-[768px] md:flex md:flex-col md:justify-center md:items-start md:basis-2/4">
        <p class="typography-text-xs md:typography-text-sm font-bold tracking-widest text-neutral-500 uppercase">
          Feel the music
        </p>
        <h1 class="typography-display-2 md:typography-display-1 md:leading-[67.5px] font-bold mt-2 mb-4">
          New Wireless Pro
        </h1>
        <p class="typography-text-base md:typography-text-lg">
          Spatial audio. Adjustable ear cups. On-device controls. All-day battery.
        </p>
        <div class="flex flex-col md:flex-row gap-4 mt-6">
          <SfButton size="lg"> Order now </SfButton>
          <SfButton size="lg" variant="secondary" class="bg-white"> Show more </SfButton>
        </div>
      </div>
    </div>
  </div>
  <div class="max-w-screen-3xl mx-auto md:px-6 lg:px-10">
    <div class="flex flex-wrap gap-4 lg:gap-6 lg:flex-no-wrap justify-center my-10">
      <div
        v-for="{ title, image } in categories"
        :key="title"
        class="relative flex-col min-w-[140px] max-w-[240px] justify-center group"
      >
        <a
          class="absolute w-full h-full z-1 focus-visible:outline focus-visible:outline-offset focus-visible:rounded-md"
          href="#"
          :aria-label="title"
        />
        <img
          class="rounded-full bg-neutral-100 group-hover:shadow-xl group-active:shadow-none"
          :src="image"
          :alt="title"
          width="240"
          height="240"
        />
        <div class="flex justify-center">
          <a
            class="mt-4 font-semibold no-underline text-normal-900 typography-text-base group-hover:underline group-hover:text-primary-800 group-hover:font-normal group-active:text-primary-800 group-active:font-normal"
          >
            {{ title }}
          </a>
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
          <img :src="image" :alt="title" class="w-1/2 self-end object-contain" />
        </div>
      </div>
    </div>
    <section class="mx-4 mt-28 mb-20 overflow-hidden">
      <NuxtLazyHydrate when-visible>
        <RecommendedProducts v-if="recommendedProducts" :products="recommendedProducts" />
      </NuxtLazyHydrate>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { SfButton } from '@storefront-ui/vue';

const { data: categoryTree } = useCategoryTree();
const defaultCategory = categoryTree.value[0];

const { data: recommendedProducts, fetchProductRecommended } = useProductRecommended(String(defaultCategory.id));

await fetchProductRecommended(defaultCategory.id.toString());

const displayDetails = [
  {
    image: 'https://storage.googleapis.com/sfui_docs_artifacts_bucket_public/production/display.png',
    title: 'Sunny Days Ahead',
    subtitle: 'Be inspired',
    description: 'Step out in style with our sunglasses collection',
    buttonText: 'Discover now',
    reverse: false,
    backgroundColor: 'bg-negative-200',
    titleClass: 'md:typography-display-2',
    subtitleClass: 'md:typography-headline-6',
    descriptionClass: 'md:typography-text-lg',
  },
  {
    image: 'https://storage.googleapis.com/sfui_docs_artifacts_bucket_public/production/display-2.png',
    title: 'Pack it Up',
    subtitle: 'Be active',
    description: 'Explore the great outdoors with our backpacks',
    buttonText: 'Discover now',
    reverse: true,
    backgroundColor: 'bg-warning-200',
  },
  {
    image: 'https://storage.googleapis.com/sfui_docs_artifacts_bucket_public/production/display-3.png',
    title: 'Fresh and Bold',
    subtitle: 'New collection',
    description: 'Add a pop up color to your outfit',
    buttonText: 'Discover now',
    reverse: false,
    backgroundColor: 'bg-secondary-200',
  },
];

const categories = [
  {
    title: `Women`,
    image: 'https://storage.googleapis.com/sfui_docs_artifacts_bucket_public/production/women_category.png',
  },
  {
    title: `Men`,
    image: 'https://storage.googleapis.com/sfui_docs_artifacts_bucket_public/production/men_category.png',
  },
  {
    title: `Kid`,
    image: 'https://storage.googleapis.com/sfui_docs_artifacts_bucket_public/production/kid_category.png',
  },
];
</script>
