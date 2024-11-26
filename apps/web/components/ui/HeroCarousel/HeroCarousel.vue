<template>
  <div>
    <Swiper
      :modules="enableModules ? [Pagination, Navigation] : []"
      :slides-per-view="1"
      :navigation="enableModules && handleArrows()"
      :loop="true"
      pagination
      @slide-change="onSlideChange"
    >
      <SwiperSlide v-for="(heroItem, index) in hero" :key="index" class="md:px-7 lg:px-15">
        <UiHeroContent :hero-item-props="heroItem" />
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { HeroContentProps } from './types';
import { Navigation, Pagination } from 'swiper/modules';
import '@/assets/libraries/swiper/swiper.min.css';
import '@/assets/libraries/swiper/navigation.min.css';
import '@/assets/libraries/swiper/pagination.min.css';
const { handleArrows, onSlideChange } = useCarousel();
const { hero } = defineProps<{
  hero: HeroContentProps[];
}>();
const enableModules = computed(() => hero.length > 1);
</script>
