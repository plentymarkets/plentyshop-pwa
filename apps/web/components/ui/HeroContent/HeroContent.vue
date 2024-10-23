<template>
  <div class="relative w-full h-full">
    <div class="top-0 left-0 w-full h-full z-[-1]">
      <img
        :src="heroItemProps.image"
        :width="heroItemProps.backgroundSizes[currentSizeKey]?.width"
        :height="heroItemProps.backgroundSizes[currentSizeKey]?.height"
        alt="test"
        class="w-full h-full object-cover"
      />
      <div
        class="absolute inset-0 flex flex-col justify-center p-4 md:p-6 z-10"
        :class="{
          'items-start': heroItemProps.textAlignment === 'left',
          'items-center': heroItemProps.textAlignment === 'center',
          'items-end': heroItemProps.textAlignment === 'right',
        }"
      >
        <div class="p-4 md:p-10 md:max-w-[768px] md:flex md:flex-col md:justify-center md:items-start">
          <p class="typography-text-xs md:typography-text-sm font-bold tracking-widest text-neutral-500 uppercase">
            {{ heroItemProps.tagline }}
          </p>
          <h1
            class="typography-display-2 md:typography-display-1 md:leading-[67.5px] font-bold text-center md:text-left mt-2 mb-4"
          >
            {{ heroItemProps.heading }}
          </h1>
          <p class="typography-text-base md:typography-text-lg text-center md:text-left">
            {{ heroItemProps.description }}
          </p>
          <div class="flex flex-col md:flex-row gap-4 mt-6">
            <UiButton size="lg">{{ heroItemProps.callToAction }}</UiButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HeroItem, Sizes } from '../HeroCarousel/types';

defineProps<{
  heroItemProps: HeroItem;
}>();
const viewport = useViewport();
const currentSizeKey = computed(() => viewport.breakpoint.value as keyof Sizes);
</script>
