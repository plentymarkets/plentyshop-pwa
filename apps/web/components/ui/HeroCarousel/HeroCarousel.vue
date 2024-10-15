<template>
  <div>
    <Swiper
      :modules="[SwiperPagination, SwiperNavigation]"
      :slides-per-view="1"
      :navigation="true"
      :loop="true"
      :autoplay="{
        delay: 3000,
        disableOnInteraction: false,
      }"
      pagination
      @slide-change="onSlideChange"
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
import { SwiperPagination, SwiperNavigation } from '#imports';

onMounted(() => {
  const nextButton = document.querySelector('.swiper-button-next');
  const previousButton = document.querySelector('.swiper-button-prev');
  const activePagination = document.querySelector('.swiper-pagination-bullet-active');

  if (nextButton) {
    nextButton.classList.add('!text-primary-500');
  }
  if (previousButton) {
    previousButton.classList.add('!text-primary-500');
  }

  if (activePagination) {
    activePagination.classList.add('!bg-primary-500');
  }
});

const onSlideChange = () => {
  const paginationBullets = document.querySelectorAll('.swiper-pagination-bullet');
  paginationBullets.forEach((bullet) => {
    bullet.classList.remove('!bg-primary-500');
  });

  const linkActivePagination = document.querySelector('.swiper-pagination-bullet-active');
  if (linkActivePagination) {
    linkActivePagination.classList.add('!bg-primary-500');
  }
};

defineProps<{
  heroProps: HeroItem[];
}>();
</script>
