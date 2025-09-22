<template>
  <div class="relative w-full" :class="['flex justify-center']" :style="[wrapperStyle, gridInlineStyle]">
    <component
      :is="linkTag"
      v-if="hasImage"
      :to="linkTarget"
      :aria-label="ariaLabel"
      v-bind="isExternalLink(linkTarget) ? { target: '_blank', rel: 'noopener' } : {}"
    >
      <NuxtImg
        :src="getImageUrl()"
        :alt="props.content.image.alt"
        class="absolute inset-0 w-full h-full"
        :class="props.content.image.fillMode === 'fit' ? 'object-contain' : 'object-cover'"
        :style="{
          display: 'block',
          filter: props.content.image.brightness ? `brightness(${props.content.image.brightness ?? 1})` : '',
        }"
        :width="getImageDimensions().width"
        :height="getImageDimensions().height"
        data-testid="image-block"
      />
    </component>

    <div
      v-if="props.content?.text?.textOverlay && runtimeConfig.public.isDev"
      class="absolute inset-0 px-4 pointer-events-none flex flex-col"
      :class="overlayAlignClasses"
      :style="{ color: props.content.text?.textOverlayColor || '#000' }"
      data-testid="image-overlay-text"
    >
      <div v-html="props.content.text.textOverlay" />
      <UiButton
        v-if="props.content?.button.label"
        class="mt-4 cursor-pointer pointer-events-auto"
        :tag="NuxtLink"
        :to="localePath(props.content.button.link ?? '')"
        :variant="props.content.button.variant ?? 'primary'"
        size="lg"
        :data-testid="'image-button-' + (meta?.uuid ?? '')"
        v-bind="isExternalLink(props.content.button.link) ? { target: '_blank', rel: 'noopener' } : {}"
      >
        {{ props.content.button.label }}
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

const hasImage = computed(() => !!props.content?.image);
const linkTarget = computed(() =>
  props.content?.image?.linktarget?.trim() ? localePath(props.content.image.linktarget) : undefined,
);
const linkTag = computed(() => (linkTarget.value ? NuxtLink : 'div'));
const ariaLabel = computed(() => props.content?.image?.alt || 'Image link');

const isExternalLink = (link: string | undefined) => !!link && /^(https?:)?\/\//.test(link);

const getAspectRatio = () => {
  switch (viewport.breakpoint.value) {
    case '4xl': {
      return props.content?.image?.aspectRatio || '16 / 9';
    }
    case 'lg': {
      return props.content?.image?.aspectRatio || '16 / 9';
    }
    case 'md': {
      return props.content?.image?.aspectRatio || '4 / 3';
    }
    default: {
      return props.content?.image?.aspectRatio || '1 / 1';
    }
  }
};

const wrapperStyle = computed(() => ({
  aspectRatio: getAspectRatio(),
  position: 'relative' as const,
}));
const getImageUrl = () => {
  switch (viewport.breakpoint.value) {
    case '4xl': {
      return props.content?.image?.wideScreen;
    }
    case 'lg': {
      return props.content?.image?.desktop;
    }
    case 'md': {
      return props.content?.image?.tablet;
    }
    default: {
      return props.content?.image?.mobile;
    }
  }
};
const overlayAlignClasses = computed(() => {
  const vertical =
    props.content?.text.textOverlayAlignY === 'top'
      ? 'items-start'
      : props.content?.text.textOverlayAlignY === 'bottom'
        ? 'items-end'
        : 'items-center';

  const horizontal =
    props.content?.text.textOverlayAlignX === 'left'
      ? 'justify-start text-left'
      : props.content?.text.textOverlayAlignX === 'right'
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

const gridInlineStyle = computed(() => {
  const layout = props.content.layout ?? {};
  return {
    paddingTop: `${layout.paddingTop ?? 0}px`,
    paddingBottom: `${layout.paddingBottom ?? 0}px`,
    paddingLeft: `${layout.paddingLeft ?? 0}px`,
    paddingRight: `${layout.paddingRight ?? 0}px`,
  };
});
</script>
