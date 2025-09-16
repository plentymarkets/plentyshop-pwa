<template>
  <div class="relative flex justify-center">
    <NuxtImg
      :src="getImageUrl()"
      :alt="props.content?.alt"
      :class="[
        'object-cover',
        'md:px-4',
        {
          'lg:pr-4': props.content?.imageAlignment === 'left',
          'lg:pl-4': props.content?.imageAlignment === 'right',
        },
      ]"
      :style="{
        filter: props.content.brightness ? 'brightness(' + (props.content.brightness ?? 1) + ')' : '',
      }"
      :width="getImageDimensions().width"
      :height="getImageDimensions().height"
      data-testid="image-block"
    />
    <div
      v-if="props.content?.textOverlay && runtimeConfig.public.isDev"
      class="absolute w-full h-full px-4 pointer-events-none flex flex-col"
      :class="overlayAlignClasses"
      data-testid="image-overlay-text"
      :style="{ color: props.content.textOverlayColor || '#000' }"
    >
      <div v-html="props.content.textOverlay" />
      <UiButton
        v-if="props.content?.label"
        class="mt-4 cursor-pointer pointer-events-auto"
        :tag="NuxtLink"
        :to="localePath(props.content.link ?? '')"
        :variant="props.content.variant ?? 'primary'"
        size="lg"
        :data-testid="'image-button-' + (meta?.uuid ?? '')"
      >
        {{ props.content.label }}
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ImageProps, ImageDimensions } from './types';
const runtimeConfig = useRuntimeConfig();

const viewport = useViewport();
const NuxtLink = resolveComponent('NuxtLink');
const localePath = useLocalePath();

const props = defineProps<ImageProps>();

const getImageUrl = () => {
  switch (viewport.breakpoint.value) {
    case '4xl': {
      return props.content?.wideScreen;
    }
    case 'lg': {
      return props.content?.desktop;
    }
    case 'md': {
      return props.content?.tablet;
    }
    default: {
      return props.content?.mobile;
    }
  }
};
const overlayAlignClasses = computed(() => {
  const vertical =
    props.content?.textOverlayAlignY === 'top'
      ? 'items-start'
      : props.content?.textOverlayAlignY === 'bottom'
        ? 'items-end'
        : 'items-center';

  const horizontal =
    props.content?.textOverlayAlignX === 'left'
      ? 'justify-start text-left'
      : props.content?.textOverlayAlignX === 'right'
        ? 'justify-end text-right'
        : 'justify-center text-center';

  return [vertical, horizontal];
});
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
