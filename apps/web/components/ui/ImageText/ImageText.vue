<template>
  <div
    data-testid="text-image-parent"
    :style="{ color: props.text?.color }"
    :class="['flex flex-col items-center', positionClass]"
  >
    <NuxtImg
      :src="getImageUrl()"
      :alt="props.image?.alt"
      :class="[
        'lg:w-1/2',
        'object-cover',
        'md:px-4',
        { 'lg:pr-4': props.image?.imageAlignment === 'left', 'lg:pl-4': props.image?.imageAlignment === 'right' },
      ]"
      :width="getImageDimensions().width"
      :height="getImageDimensions().height"
      data-testid="image-block"
    />
    <TextContent class="lg:w-1/2" :text="props.text" :button="props.button" />
  </div>
</template>

<script setup lang="ts">
import type { ImageTextProps, ImageDimensions } from '~/components/ui/ImageText/types';

const viewport = useViewport();

const props = defineProps<ImageTextProps>();

const positionClass = computed(() => (props.image?.imageAlignment === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'));

const getImageUrl = () => {
  switch (viewport.breakpoint.value) {
    case '4xl': {
      return props.image?.wideScreen;
    }
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
    case '4xl': {
      return { width: 696, height: 392 };
    }
    case 'lg': {
      return { width: 712, height: 474 };
    }
    case 'md': {
      return { width: 757, height: 483 };
    }
    default: {
      return { width: 320, height: 320 };
    }
  }
};
</script>
