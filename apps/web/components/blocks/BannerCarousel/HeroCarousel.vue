<template>
  <Swiper
    :key="index"
    :modules="enableModules ? [Pagination, Navigation] : []"
    :slides-per-view="1"
    :loop="true"
    :pagination="paginationConfig"
    :navigation="navigationConfig"
    class="!z-0 !w-full !max-h-[85vh]"
    @swiper="onSwiperInit"
    @slide-change="onSlideChange"
  >
    <SwiperSlide v-for="(bannerItem, slideIndex) in bannerItems" :key="slideIndex">
      <BlocksBannerCarouselBanner :banner-props="bannerItem" :index="slideIndex" />
    </SwiperSlide>
    <div
      v-if="enableModules"
      :class="`swiper-pagination swiper-pagination-${index} swiper-pagination-bullets swiper-pagination-horizontal`"
    />
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
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Navigation } from 'swiper/modules';
import type { BannerProps } from './types';
import type { Swiper as SwiperType } from 'swiper';
import type { SlideControls } from '~/composables/useHomepage/types';

const { activeSlideIndex, setIndex } = useHomepage();
const { handleArrows } = useCarousel();
const { bannerItems, index, controls } = defineProps<{
  bannerItems: BannerProps[];
  controls: SlideControls;
  index: number;
}>();
const enableModules = computed(() => bannerItems.length > 1);

let slider: SwiperType | null = null;

const paginationConfig = computed(() => {
  return enableModules.value && controls.color
    ? {
        el: `.swiper-pagination-${index}`,
        clickable: true,
        bulletActiveClass: 'swiper-pagination-bullet-active !bg-primary-500',
        renderBullet(index: number, className: string) {
          return `<span key="dot-${index}" class="${className}" style="background-color: ${controls.color}!important;"></span>`;
        },
      }
    : false;
});

const navigationConfig = computed(() => {
  return enableModules.value
    ? {
        nextEl: `.swiper-button-next-${index}`,
        prevEl: `.swiper-button-prev-${index}`,
      }
    : false;
});

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

watch(
  () => controls.color,
  (newColor, oldColor) => {
    if (slider && !slider.destroyed && newColor !== oldColor) {
      slider.pagination.render();
      slider.pagination.update();
    }
  },
);
</script>

<style src="./styles/navigation.min.css"></style>
<style src="./styles/pagination.min.css"></style>
<style src="./styles/swiper.min.css"></style>
