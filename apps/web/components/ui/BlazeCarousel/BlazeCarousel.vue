<template>
  <div class="blaze-slider">
    <div class="blaze-container">
      <div class="blaze-track-container">
        <div class="blaze-track">
          <div v-for="(bannerItem, index) in bannerItems" :key="index" class="blaze-slide">
            <UiBanner :banner-props="bannerItem" :index="index" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BlazeSlider from 'blaze-slider';
import 'blaze-slider/dist/blaze.css';
import type { BannerProps } from '../Banner/types';

const { bannerItems } = defineProps<{ bannerItems: BannerProps[] }>();

onMounted(() => {
  const el = document.querySelector('.blaze-slider');
  if (el) {
    new BlazeSlider(el as HTMLElement, {
      all: {
        slidesToShow: 1,
        loop: true,
        enableAutoplay: true,
      },
    });
  }
});
</script>
