<template>
  <div class="flex md:flex-row md:items-center w-full">
    <div class="">
      <p class="typography-text-xs md:typography-text-sm font-bold tracking-widest text-neutral-500 uppercase">
        {{ props.slideData.tagline }}
      </p>
      <h1 class="typography-display-2 md:typography-display-1 md:leading-[67.5px] font-bold mt-2 mb-4">
        {{ props.slideData.heading }}
      </h1>
      <p class="typography-text-base md:typography-text-lg">
        {{ props.slideData.description }}
      </p>
      <div class="flex flex-col md:flex-row gap-4 mt-6">
        <UiButton size="lg">{{ props.slideData.callToAction }}</UiButton>
      </div>
    </div>

    <div class="flex-shrink-0">
      <img :src="props.slideData.image" :alt="props.slideData.heading" class="w-full h-auto object-cover" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { HeroItem } from '~/components/ui/HeroCarousel/types';

const props = defineProps<{
  slideData: HeroItem;
}>();
</script>

<style scoped>
.flex {
  display: flex;
  width: 100%;
}
</style>
