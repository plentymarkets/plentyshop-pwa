<template>
  <div class="relative">
    <Swiper
      :key="enableNavigation ? 'nav' : 'no-nav'"
      :slides-per-view="1"
      :loop="enableNavigation"
      :modules="enableNavigation ? [Navigation] : []"
      :navigation="navigationConfig"
    >
      <SwiperSlide v-for="(item, idx) in visibleItems" :key="idx">
        <div
          class="min-h-10 flex items-center justify-center rte-prose rte-prose--render"
          :style="inlineStyle"
          v-html="item.content.text"
        />
      </SwiperSlide>
    </Swiper>

    <button
      v-if="enableNavigation"
      type="button"
      data-testid="swiper-button-prev-announcement"
      class="swiper-button-prev-announcement absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center"
      :style="{ color: props.configuration.controls.color }"
    >
      <SfIconChevronLeft size="sm" />
    </button>
    <button
      v-if="enableNavigation"
      type="button"
      data-testid="swiper-button-next-announcement"
      class="swiper-button-next-announcement absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center"
      :style="{ color: props.configuration.controls.color }"
    >
      <SfIconChevronRight size="sm" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';
import { SfIconChevronLeft, SfIconChevronRight } from '@storefront-ui/vue';
import type { AnnouncementBarProps } from './types';

const props = defineProps<AnnouncementBarProps>();

const visibleItems = computed(() => props.content.filter((item) => item.content.visible !== false));
const enableNavigation = computed(() => visibleItems.value.length > 1);

const navigationConfig = computed(() => ({
  nextEl: '.swiper-button-next-announcement',
  prevEl: '.swiper-button-prev-announcement',
}));

const inlineStyle = computed(() => {
  const layout = props.configuration.layout || {};

  return {
    paddingTop: layout.paddingTop ? `${layout.paddingTop}px` : 0,
    paddingBottom: layout.paddingBottom ? `${layout.paddingBottom}px` : 0,
    paddingLeft: layout.paddingLeft ? `${layout.paddingLeft}px` : 0,
    paddingRight: layout.paddingRight ? `${layout.paddingRight}px` : 0,
    backgroundColor: layout.backgroundColor || 'transparent',
  };
});
</script>
