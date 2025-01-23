<template>
  <ClientOnly>
    <Swiper
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
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }
          : false
      "
      class="!z-0 !w-full !max-h-[85vh]"
      @swiper="onSwiperInit"
      @slide-change="onSlideChange"
    >
      <SwiperSlide v-for="(bannerItem, index) in bannerItems" :key="index">
        <UiBanner :banner-props="bannerItem" :index="index" />
      </SwiperSlide>
      <div class="swiper-pagination swiper-pagination-bullets swiper-pagination-horizontal">
        <span
          v-for="(bannerItem, index) in bannerItems"
          :key="'dot-' + index"
          class="swiper-pagination-bullet"
          :style="{
            backgroundColor: generalTextColor + ' !important',
          }"
          :class="{ 'swiper-pagination-bullet-active': index === activeIndex }"
        />
      </div>
    </Swiper>

    <div
      v-if="enableModules && handleArrows()"
      class="swiper-button-prev"
      :style="{ color: generalTextColor + ' !important' }"
    />
    <div
      v-if="enableModules && handleArrows()"
      class="swiper-button-next"
      :style="{ color: generalTextColor + ' !important' }"
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

const { handleArrows } = useCarousel();
const { bannerItems } = defineProps<{ bannerItems: BannerProps[] }>();
const enableModules = computed(() => bannerItems.length > 1);

const generalTextColor = ref('inherit');
const activeIndex = ref(0);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSwiperInit = (swiper: any) => {
  generalTextColor.value = bannerItems[0]?.text?.color ?? 'inherit';
  activeIndex.value = swiper.realIndex;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSlideChange = (swiper: any) => {
  activeIndex.value = swiper.realIndex;
};
</script>

<style src="./styles/navigation.min.css"></style>
<style src="./styles/pagination.min.css"></style>
<style src="./styles/swiper.min.css"></style>
