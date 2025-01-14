<template>
  <div v-if="showComponent" :class="['flex flex-col md:flex-row items-center', positionClass]">
    <div :class="['w-full', 'md:w-1/2']">
      <NuxtImg
        :src="getImageUrl()?.src"
        :alt="props.image?.alt"
        class="mx-auto h-auto object-cover"
        :width="getImageUrl()?.width"
        :height="getImageUrl()?.height"
      />
    </div>
    <TextContent :text="props.text" :button="props.button" />
  </div>
</template>

<script setup lang="ts">
import type { ImageTextProps, ImageSource } from '~/components/ui/ImageText/types';

const viewport = useViewport();

const props = defineProps<ImageTextProps>();

const showComponent = computed(() => {
  return props.image || props.text;
});

const positionClass = computed(() => (props.image?.imageAlignment === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'));

const getImageUrl = (): ImageSource | undefined => {
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
</script>
