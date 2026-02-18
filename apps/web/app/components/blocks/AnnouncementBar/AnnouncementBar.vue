<template>
  <div class="relative">
    <Swiper
      :slides-per-view="1"
      :loop="visibleItems.length > 1"
      :modules="visibleItems.length > 1 ? [Navigation] : []"
      :navigation="navigationConfig"
    >
      <SwiperSlide v-for="(item, idx) in visibleItems" :key="idx">
        <div
          class="min-h-10 flex items-center justify-center rte-prose rte-prose--render"
          :style="inlineStyle"
          v-html="item.text"
        />
      </SwiperSlide>
    </Swiper>

    <button
      v-if="visibleItems.length > 1"
      type="button"
      class="swiper-button-prev-announcement absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center"
    >
      <SfIconChevronLeft size="sm" class="text-black" />
    </button>
    <button
      v-if="visibleItems.length > 1"
      type="button"
      class="swiper-button-next-announcement absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center"
    >
      <SfIconChevronRight size="sm" class="text-black" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';
import { SfIconChevronLeft, SfIconChevronRight } from '@storefront-ui/vue';
import type { AnnouncementBarProps } from './types';

const props = defineProps<AnnouncementBarProps>();

const visibleItems = computed(() => props.content.announcements.filter((a) => a.visible !== false));

const navigationConfig = computed(() => ({
  nextEl: '.swiper-button-next-announcement',
  prevEl: '.swiper-button-prev-announcement',
}));

const inlineStyle = computed(() => {
  const layout = props.content.layout || {};

  return {
    paddingTop: layout.paddingTop ? `${layout.paddingTop}px` : 0,
    paddingBottom: layout.paddingBottom ? `${layout.paddingBottom}px` : 0,
    paddingLeft: layout.paddingLeft ? `${layout.paddingLeft}px` : 0,
    paddingRight: layout.paddingRight ? `${layout.paddingRight}px` : 0,
    backgroundColor: layout.backgroundColor || 'transparent'
  };
});
</script>