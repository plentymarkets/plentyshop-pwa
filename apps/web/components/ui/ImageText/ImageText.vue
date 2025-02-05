<template>
  <div :class="['flex flex-col md:flex-row items-center', positionClass]">
    <div :class="['md:w-1/2']">
      <NuxtImg
        :src="getImageUrl()"
        :alt="props.image?.alt"
        :class="[
          'h-auto',
          'object-cover',
          { 'pr-4': props.image?.imageAlignment === 'left', 'pl-4': props.image?.imageAlignment === 'right' },
        ]"
        :width="getImageDimensions().width"
        :height="getImageDimensions().height"
      />
    </div>
    <TextContent :text="props.text" :button="props.button" />
  </div>
</template>

<script setup lang="ts">
import type { ImageTextProps, ImageDimensions } from '~/components/ui/ImageText/types';

const viewport = useViewport();

const props = defineProps<ImageTextProps>();

const positionClass = computed(() => (props.image?.imageAlignment === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'));

const getImageUrl = () => {
  switch (viewport.breakpoint.value) {
    case 'lg': {
      return props.image?.desktop;
    }
    case 'md': {
      return props.image?.tablet;
    }
    default: {
      return props.image?.mobile;
    }
  }
};

const getImageDimensions = (): ImageDimensions => {
  switch (viewport.breakpoint.value) {
    case 'lg': {
      return { width: 1200, height: 800 };
    }
    case 'md': {
      return { width: 800, height: 533 };
    }
    default: {
      return { width: 400, height: 267 };
    }
  }
};
</script>
