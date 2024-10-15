<template>
  <div class="relative mb-10">
    <Swiper
      :modules="[SwiperPagination]"
      :slides-per-view="1"
      :loop="true"
      :autoplay="{
        delay: 3000,
        disableOnInteraction: false,
      }"
      pagination
    >
      <SwiperSlide v-for="(heroItem, index) in heroProps" :key="index">
        <HeroContent :hero-item="heroItem" />
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { HeroItem } from './types';
import { SwiperPagination } from '#imports';

defineProps<{
  heroProps: HeroItem[];
}>();
</script>
