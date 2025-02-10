<template>
  <ClientOnly>
    <Swiper
      :key="index"
      :modules="enableModules ? [Pagination, Navigation] : []"
      :slides-per-view="1"
      :loop="true"
      :pagination="
        enableModules
          ? {
              el: '.custom-swiper-pagination',
              clickable: true,
            }
          : false
      "
      :navigation="
        enableModules
          ? {
              nextEl: `.swiper-button-next-${index}`,
              prevEl: `.swiper-button-prev-${index}`,
            }
          : false
      "
      class="!z-0 !w-full !max-h-[85vh]"
      @swiper="onSwiperInit"
      @slide-change="onSlideChange"
    >
      <SwiperSlide v-for="(bannerItem, slideIndex) in bannerItems" :key="slideIndex">
        <UiBanner :banner-props="bannerItem" :index="slideIndex" />
      </SwiperSlide>
      <div class="swiper-pagination swiper-pagination-bullets swiper-pagination-horizontal">
        <span
          v-for="(bannerItem, bannerItemIndex) in bannerItems"
          :key="'dot-' + bannerItemIndex"
          class="swiper-pagination-bullet"
          :style="{
            backgroundColor: controls.color + ' !important',
          }"
          :class="{ 'swiper-pagination-bullet-active': bannerItemIndex === activeSlideIndex[index] }"
        />
      </div>
    </Swiper>

    <div
      v-if="enableModules && handleArrows()"
      :key="`prev-${index}`"
      :class="`swiper-button-prev swiper-button-prev-${index}`"
      :style="{ color: controls.color + ' !important' }"
    />
    <div
      v-if="enableModules && handleArrows()"
      :key="`next-${index}`"
      :class="`swiper-button-next swiper-button-next-${index}`"
      :style="{ color: controls.color + ' !important' }"
    />

    <template #fallback>
      <UiBannerSkeleton />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Navigation } from 'swiper/modules';
import type { BannerProps } from '../Banner/types';
import type { Swiper as SwiperType } from 'swiper';
import type { SlideControls } from '~/composables/useHomepage/types';

const { activeSlideIndex, setIndex } = useHomepage();
const { handleArrows } = useCarousel();
const { bannerItems, index } = defineProps<{ bannerItems: BannerProps[]; controls: SlideControls; index: number }>();
const enableModules = computed(() => bannerItems.length > 1);

let slider: SwiperType | null = null;

const onSwiperInit = (swiper: SwiperType) => {
  slider = swiper;
  setIndex(index, swiper.realIndex);
};

const onSlideChange = async (swiper: SwiperType) => {
  if (swiper.realIndex !== activeSlideIndex.value[index]) {
    await nextTick();
    swiper.update();

    setIndex(index, swiper.realIndex);
  }
};

watch(
  () => activeSlideIndex.value[index],
  (newIndex) => {
    if (slider && !slider.destroyed && slider.realIndex !== newIndex) {
      slider.update();
      slider.slideTo(newIndex);
    }
  },
  { flush: 'post' },
);
</script>

<style src="./styles/navigation.min.css"></style>
<style src="./styles/pagination.min.css"></style>
<style src="./styles/swiper.min.css"></style>
