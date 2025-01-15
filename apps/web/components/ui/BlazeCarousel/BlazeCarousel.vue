<template>
  <div class="blaze-slider relative">
    <div class="blaze-container">
      <div class="blaze-track-container">
        <div class="blaze-track flex gap-4 w-full">
          <div
            v-for="(bannerItem, index) in bannerItems"
            :key="index"
            class="blaze-slide relative flex-shrink-0 w-full h-auto overflow-hidden"
          >
            <UiBanner :banner-props="bannerItem" :index="index" />
          </div>
        </div>
      </div>

      <button v-if="!isMobile" class="blaze-prev absolute left-[-18px] top-1/2 -translate-y-1/2 text-white">
        <svg class="w-20 h-20" fill="none" :stroke="generalTextColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>

      <button v-if="!isMobile" class="blaze-next absolute right-[-18px] top-1/2 -translate-y-1/2 text-white">
        <svg class="w-20 h-20" fill="none" :stroke="generalTextColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>

    <div
      class="blaze-pagination absolute flex bottom-[20px] left-1/2 transform -translate-x-1/2 justify-center gap-2 mt-4"
    ></div>
  </div>
</template>

<script setup lang="ts">
import BlazeSlider from 'blaze-slider';
import 'blaze-slider/dist/blaze.css';
import type { BannerProps } from '../Banner/types';

const { bannerItems } = defineProps<{ bannerItems: BannerProps[] }>();
const generalTextColor = ref('inherit');

const viewport = useViewport();
const isMobile = computed(() => viewport.isLessThan('lg'));

generalTextColor.value = bannerItems[0]?.text?.color ?? 'inherit';

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

<style>
.blaze-pagination button {
  font-size: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  outline: none;
  border: none;
  background: v-bind(generalTextColor);
  cursor: pointer;
  transition:
    transform 200ms ease,
    background-color 300ms ease;
}

.blaze-pagination button.active {
  background: v-bind(generalTextColor);
  transform: scale(1.3);
}
</style>