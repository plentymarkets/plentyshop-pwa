<template>
  <div class="blaze-slider">
    <div class="blaze-container relative">
      <div class="blaze-track-container">
        <div class="blaze-track flex gap-4 w-full">
          <div
            v-for="(bannerItem, index) in bannerItems"
            :key="index"
            class="blaze-slide flex-shrink-0 w-full h-auto  overflow-hidden"
          >
            <UiBanner :banner-props="bannerItem" :index="index" />
          </div>
        </div>
      </div>
    </div>
  </div>


  <!-- <div class="my-pagination-container">
          <div class="blaze-pagination"></div>
        </div> -->

  <!-- navigation buttons -->
  <!-- <div class="my-nav-container">
        <button class="blaze-prev">previous</button>
        <button class="blaze-next">next</button>
      </div> -->
</template>

<script setup lang="ts">
import BlazeSlider from 'blaze-slider';
import 'blaze-slider/dist/blaze.css';
import type { BannerProps } from '../Banner/types';

const { bannerItems } = defineProps<{ bannerItems: BannerProps[] }>();
console.log('Banner Items:', bannerItems);

onMounted(() => {
  const el = document.querySelector('.blaze-slider');
  if (el) {
    new BlazeSlider(el as HTMLElement, {
      all: {
        slidesToShow: 1,
      },
    });
  }
});
</script>
