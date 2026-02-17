<template>
  <Swiper
    :slides-per-view="1"
    :loop="props.content.announcements.length > 1"
    :modules="[Autoplay]"
    :autoplay="{ delay: 6000, disableOnInteraction: false }"
    :speed="900"
  >
    <SwiperSlide v-for="(item, idx) in props.content.announcements.filter(a => a.visible !== false)" :key="idx">
      <div
        class="min-h-10 flex items-center justify-center rte-prose rte-prose--render"
        :style="inlineStyle"
        v-html="item.text"
      />
    </SwiperSlide>
  </Swiper>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay } from 'swiper/modules';
import type { AnnouncementBarProps } from './types';

const props = defineProps<AnnouncementBarProps>();

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