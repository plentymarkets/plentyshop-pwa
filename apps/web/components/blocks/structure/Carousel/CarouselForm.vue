<template>
  <div
    data-testid="banner-carousel-form"
    class="sticky top-[52px] h-[calc(100vh-150px)] overflow-y-auto"
  >
    <SliderNavigation />
    <div :data-testid="`slide-settings-${activeSlideIndex}`">
      <BlocksBannerCarouselBannerForm
        :active-slide-index="activeSlideIndex"
        :uuid="slides[activeSlideIndex].meta.uuid"
      />
      <BannerCarouselControls />
    </div>
  </div>
</template>

<script setup lang="ts">
import BannerCarouselControls from './BannerCarouselControls.vue';
import SliderNavigation from './SliderNavigation.vue';
import type { BannerProps } from '~/components/blocks/BannerCarousel/types';
import type { CarouselStructureProps } from './types';
const { blockUuid } = useSiteConfiguration();
const { updateBannerItems, getCarouselStructureByBlockUid, activeSlidesIndex } = useCarousel();

const carouselStructure = (getCarouselStructureByBlockUid(blockUuid.value) || {}) as CarouselStructureProps;
const activeSlideIndex = computed(() => activeSlidesIndex.value[blockUuid.value]);
const slides = computed({
  get: () => {
    return (carouselStructure.content || []) as BannerProps[];
  },
  set: (value: BannerProps[]) => updateBannerItems(value, blockUuid.value),
});
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
