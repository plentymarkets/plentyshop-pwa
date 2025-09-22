<!-- <template>
  <div ref="imageRow" :class="['relative flex justify-center', 'h-[450px]' ,'w-[450px]']" :style="gridInlineStyle">
    <template v-if="props.content?.image">
      <template v-if="props.content.image.linktarget && props.content.image.linktarget.trim()">
        <NuxtLink
          :to="localePath(props.content.image.linktarget)"
          :aria-label="props.content.image.alt || 'Image link'"
          data-testid="image-link"
        >
          <NuxtImg
            :src="getImageUrl()"
            :alt="props.content.image.alt"
            :class="[
              props.content.image.fillMode === 'fit' ? 'object-contain' : 'object-cover',
             
              'md:px-4',
              {
                'lg:pr-4': props.content.image.imageAlignment === 'left',
                'lg:pl-4': props.content.image.imageAlignment === 'right',
              },
            ]"
            :style="{
              filter: props.content.image.brightness ? 'brightness(' + (props.content.image.brightness ?? 1) + ')' : '',
            }"
            :width="getImageDimensions().width"
            :height="getImageDimensions().height"
            data-testid="image-block"
          />
        </NuxtLink>
      </template>
      <template v-else>
        <NuxtImg
          :src="getImageUrl()"
          :alt="props.content.image.alt"
          :class="[
            props.content.image.fillMode === 'fit'
              ? 'object-contain'
              : props.content.image.fillMode === 'fill'
                ? 'object-cover'
                : 'object-cover',
            'md:px-4',
            {
              'lg:pr-4': props.content.image.imageAlignment === 'left',
              'lg:pl-4': props.content.image.imageAlignment === 'right',
            },
          ]"
          :style="{
            filter: props.content.image.brightness ? 'brightness(' + (props.content.image.brightness ?? 1) + ')' : '',
          }"
          :width="getImageDimensions().width"
          :height="getImageDimensions().height"
          data-testid="image-block"
        />
      </template>
    </template>
    <div
      v-if="props.content?.text?.textOverlay && runtimeConfig.public.isDev"
      class="absolute w-full h-full px-4 pointer-events-none flex flex-col"
      :class="overlayAlignClasses"
      data-testid="image-overlay-text"
      :style="{ color: props.content.text?.textOverlayColor || '#000' }"
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
      >
        {{ props.content.button.label }}
      </UiButton>
    </div>
  </div>
</template> -->

<template>
  <div class="relative w-full" :class="['flex justify-center']" :style="[wrapperStyle, gridInlineStyle]">
    <component :is="linkTag" v-if="hasImage" :to="linkTarget" :aria-label="ariaLabel">
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
  props.content?.image?.linktarget?.trim() ? localePath(props.content.image.linktarget) : null,
);
const linkTag = computed(() => (linkTarget.value ? NuxtLink : 'div'));
const ariaLabel = computed(() => props.content?.image?.alt || 'Image link');

const wrapperStyle = computed(() => {
  const img = props.content?.image;
  // '16 / 9'
  const ratio = img?.aspectRatio || '4 / 3';

  return {
    aspectRatio: ratio,
    position: 'relative' as const,
  };
});

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
