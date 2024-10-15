<template>
  <div>
    <Swiper
      :modules="[Pagination, Navigation]"
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
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';

import '@/assets/swiper.min.css';
import '@/assets/navigation.min.css';
import '@/assets/pagination.min.css';

const handleArrowsVisibility = () => {
  const nextButton = document.querySelector('.swiper-button-next') as HTMLElement;
  const previousButton = document.querySelector('.swiper-button-prev') as HTMLElement;

  if (window.innerWidth < 768) {
    if (nextButton) nextButton.style.display = 'none';
    if (previousButton) previousButton.style.display = 'none';
  } else {
    if (nextButton) nextButton.style.display = 'block';
    if (previousButton) previousButton.style.display = 'block';
  }
};

onMounted(() => {
  handleArrowsVisibility();
  window.addEventListener('resize', handleArrowsVisibility);

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
