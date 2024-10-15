<template>
  <div class="md:flex md:flex-row-reverse md:justify-center max-w-[1536px] mx-auto md:min-h-[600px] mb-10 text-center">
    <div class="flex flex-col md:basis-2/4 md:items-stretch md:overflow-hidden">
      <img
        :src="heroItem.image"
        :width="heroItem.backgroundSizes?.lg.width"
        :height="heroItem.backgroundSizes?.lg.height"
        alt="test"
        class="h-full object-cover object-left md:h-full md:object-contain"
      />
    </div>
    <div class="p-4 md:p-10 md:max-w-[768px] md:flex md:flex-col md:justify-center md:items-start md:basis-2/4">
      <p class="typography-text-xs md:typography-text-sm font-bold tracking-widest text-neutral-500 uppercase">
        {{ heroItem.tagline }}
      </p>
      <h1
        class="typography-display-2 md:typography-display-1 md:leading-[67.5px] font-bold text-center md:text-left mt-2 mb-4"
      >
        {{ heroItem.heading }}
      </h1>
      <p class="typography-text-base md:typography-text-lg text-center md:text-left">
        {{ heroItem.description }}
      </p>
      <div class="flex flex-col md:flex-row gap-4 mt-6">
        <UiButton size="lg">{{ heroItem.callToAction }}</UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { HeroItem } from '../ui/HeroCarousel/types';

defineProps<{
  heroItem: HeroItem;
}>();
</script>
