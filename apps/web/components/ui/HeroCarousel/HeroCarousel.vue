<template>
  <div>
    <Swiper
      :modules="enableModules ? [Pagination, Navigation] : []"
      :slides-per-view="1"
      :navigation="enableModules ? true : false"
      :loop="true"
      :autoplay="{
        delay: 3000,
        disableOnInteraction: false,
      }"
      pagination
      @slide-change="onSlideChange"
      wrapper-class="md:px-7 lg:px-11"
    >
      <SwiperSlide v-for="(heroItem, index) in heroProps" :key="index" style="height: 100%">
        <HeroContent :hero-item="heroItem" />
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { HeroItem } from './types';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules';
const { onSlideChange } = useCarousel();
import '@/assets/libraries/swiper/swiper.min.css';
import '@/assets/libraries/swiper/navigation.min.css';
import '@/assets/libraries/swiper/pagination.min.css';

const props = defineProps<{
  heroProps: HeroItem[];
}>();

const enableModules = computed(() => props.heroProps.length > 1);
</script>
