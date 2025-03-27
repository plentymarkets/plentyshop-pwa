<template>
  <div
    data-testid="banner-carousel-form"
    class="block-slider-edit sticky top-[52px] h-[calc(100vh-150px)] overflow-y-auto"
  >
    <SliderNavigation />
    <div :data-testid="`slide-settings-${activeSlide}`">
      <BlocksBannerCarouselBannerForm :uuid="slides[activeSlide].meta.uuid" />
      <BannerCarouselControls
        v-model:color="controls.color"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import BannerCarouselControls from './BannerCarouselControls.vue';
import SliderNavigation from './SliderNavigation.vue';

import type { BannerProps } from '~/components/blocks/BannerCarousel/types';
import type { CarouselStructureProps } from './types';

const { blockUuid } = useSiteConfiguration();
const { updateBannerItems, setIndex, activeSlideIndex } = useCarousel();
const { data } = useCategoryTemplate();

//-===
const { findOrDeleteBlockByUuid } = useBlockManager();
const carouselStructure = computed(
  () => (findOrDeleteBlockByUuid(data.value, blockUuid.value) || {}) as CarouselStructureProps,
);
///----
const activeSlide = computed(() => activeSlideIndex.value[blockUuid.value]);
const slides = computed({
  get: () => {
    return (carouselStructure.value?.content || []) as BannerProps[];
  },
  set: (value: BannerProps[]) => updateBannerItems(value, blockUuid.value),
});
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
