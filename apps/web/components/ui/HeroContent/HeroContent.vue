<template>
  <div class="md:flex md:flex-row-reverse md:justify-center mx-auto mb-10 text-center">
    <div class="flex flex-col md:basis-2/4 md:items-stretch md:overflow-hidden">
      <img
        :src="heroItemProps.image"
        :width="heroItemProps.backgroundSizes && heroItemProps.backgroundSizes[currentSizeKey].width"
        :height="heroItemProps.backgroundSizes && heroItemProps.backgroundSizes[currentSizeKey].height"
        :alt="heroItemProps.alt"
        class="h-full m-auto md:h-full md:object-contain"
      />
    </div>

    <div class="p-4 md:p-10 md:max-w-[768px] md:flex md:flex-col md:justify-center md:items-start md:basis-2/4">
      <p
        class="typography-text-xs md:typography-text-sm font-bold tracking-widest uppercase"
        :style="{ color: heroItemProps.taglineColor }"
      >
        {{ heroItemProps.tagline }}
      </p>
      <h1
        class="typography-display-3 md:typography-display-1 md:leading-[67.5px] font-bold text-xs text-center md:text-left mt-2 mb-4"
        :style="{ color: heroItemProps.headingColor }"
      >
        {{ heroItemProps.heading }}
      </h1>
      <p
        class="typography-text-sm md:typography-text-lg text-center md:text-left font-normal"
        :style="{ color: heroItemProps.descriptionColor }"
      >
        {{ heroItemProps.description }}
      </p>
      <div class="flex flex-col md:flex-row gap-4 mt-6">
        <UiButton :tag="NuxtLink" :to="localePath(props.heroItemProps.link ?? '')" size="lg">{{
          heroItemProps.callToAction
        }}</UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HeroContentProps, SizeKey } from '../HeroCarousel/types';

const props = defineProps<{
  heroItemProps: HeroContentProps;
  currentSizeKey: SizeKey;
}>();

const localePath = useLocalePath();

const NuxtLink = resolveComponent('NuxtLink');
</script>
