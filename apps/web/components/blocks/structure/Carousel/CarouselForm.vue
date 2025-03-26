<template>
  <div
    data-testid="banner-carousel-form"
    class="block-slider-edit sticky top-[52px] h-[calc(100vh-150px)] overflow-y-auto"
  >
    <SliderNavigation
      :slides="slides"
      :activeSlide="activeSlide"
      :isOpen="isOpen"
      @open="open"
      @close="close"
      @slideClick="slideClick"
      @addSlide="addSlide"
      @deleteSlide="deleteSlide"
      @moveSlideUp="moveSlideUp"
      @moveSlideDown="moveSlideDown"
    />

    <div :data-testid="`slide-settings-${activeSlide}`">
      <BlocksBannerCarouselBannerForm :uuid="slides[activeSlide].meta.uuid" />
      <BannerCarouselControls
        v-model:open="controlsOpen"
        v-model:color="controls.color"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  SfScrollable,
  SfIconChevronLeft,
  SfIconChevronRight,
  SfIconDelete,
  SfInput,
  SfIconMoreHoriz,
  SfIconArrowUpward,
  SfIconArrowDownward,
  SfIconAdd,
  useDisclosure,
  SfIconClose,
} from '@storefront-ui/vue';
import type { CarouselStructureProps } from './types';
import { v4 as uuid } from 'uuid';
import type { BannerProps } from '~/components/blocks/BannerCarousel/types';
import BannerCarouselControls from './BannerCarouselControls.vue';
import SliderNavigation from './SliderNavigation.vue';

const { isOpen, open, close } = useDisclosure();
const { blockUuid } = useSiteConfiguration();
const { updateBannerItems, setIndex, activeSlideIndex } = useCarousel();
const { data } = useCategoryTemplate();
const { findOrDeleteBlockByUuid } = useBlockManager();

setIndex(blockUuid.value, 0);

const activeSlide = computed(() => activeSlideIndex.value[blockUuid.value]);

const carouselStructure = computed(
  () => (findOrDeleteBlockByUuid(data.value, blockUuid.value) || {}) as CarouselStructureProps,
);

const slides = computed({
  get: () => {
    return (carouselStructure.value?.content || []) as BannerProps[];
  },
  set: (value: BannerProps[]) => updateBannerItems(value, blockUuid.value),
});

const slideClick = async (index: number) => {
  setIndex(blockUuid.value, index);
  await nextTick();
};

const addSlide = async () => {
  const newSlide: BannerProps = {
    name: 'Banner',
    type: 'content',
    content: {
      image: {
        wideScreen: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
        desktop: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
        tablet: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
        mobile: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
        brightness: 0.5,
        alt: '',
      },
      text: {
        pretitle: 'PreTitle',
        title: 'Title',
        subtitle: 'SubTitle',
        htmlDescription: 'Text that supports HTML formatting',
        color: '#000',
        bgcolor: '#fff',
        bgopacity: 1,
        textAlignment: 'left',
        justify: 'center',
        align: 'left',
        background: false,
      },
      button: {
        label: 'Button',
        link: '/',
        variant: 'primary',
      },
    },
    meta: {
      uuid: uuid(),
    },
    lazyLoading: 'eager',
    index: slides.value.length,
  };

  slides.value = [...slides.value, newSlide] as BannerProps[];

  await nextTick();

  setIndex(blockUuid.value, slides.value.length - 1);
  close();
};

const deleteSlide = async (index: number) => {
  if (slides.value.length <= 1) return;
  slides.value = slides.value.filter((_: BannerProps, i: number) => i !== index);
  setIndex(blockUuid.value, 0);
  await nextTick();
  close();
};

const moveSlideUp = async (index: number) => {
  if (index <= 0) return;

  const newSlides = [...slides.value] as BannerProps[];

  [newSlides[index - 1], newSlides[index]] = [newSlides[index], newSlides[index - 1]];
  slides.value = newSlides;

  await nextTick();

  setIndex(blockUuid.value, index - 1);
};

const moveSlideDown = async (index: number) => {
  if (index >= slides.value.length - 1) return;

  const newSlides = [...slides.value] as BannerProps[];

  [newSlides[index], newSlides[index + 1]] = [newSlides[index + 1], newSlides[index]];
  slides.value = newSlides;

  await nextTick();

  setIndex(blockUuid.value, index + 1);
};

const controlsOpen = ref(true);
const controls = computed(() => carouselStructure.value.configuration.controls);

</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
