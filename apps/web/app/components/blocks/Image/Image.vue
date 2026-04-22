<template>
  <div class="relative w-full flex justify-center" :style="wrapperStyle" data-testid="image-block">
    <component
      :is="linkTag"
      v-if="hasImage"
      :to="linkTarget"
      :aria-label="ariaLabel"
      :class="{ 'absolute inset-0': linkTarget }"
      v-bind="isExternalLink(linkTarget) ? { target: '_blank', rel: 'noopener noreferrer' } : {}"
      data-testid="image-link"
    >
      <NuxtImg
        :src="breakpointConfig.url"
        :alt="props.content.image.alt"
        class="absolute inset-0 w-full h-full"
        :class="props.content.image.fillMode === 'fit' ? 'object-contain' : 'object-cover'"
        :style="{
          display: 'block',
          filter:
            props.content.image.brightness !== null && props.content.image.brightness !== undefined
              ? `brightness(${props.content.image.brightness})`
              : '',
          ...imageInlineStyle,
        }"
        :width="breakpointConfig.dimensions.width"
        :height="breakpointConfig.dimensions.height"
        data-testid="image-block-image"
      />
    </component>

    <div
      class="absolute inset-0 px-4 flex flex-col"
      :class="[overlayAlignClasses, { 'pointer-events-none': linkTarget }]"
      data-testid="image-overlay-wrapper"
    >
      <div :class="{ 'pointer-events-auto': linkTarget }">
        <TextContent v-bind="textContentProps" :test-id="'image-overlay'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ImageProps, BreakpointEntry } from './types';

const viewport = useViewport();
const NuxtLink = resolveComponent('NuxtLink');
const localePath = useLocalePath();
const { getBlockDepth } = useBlockManager();

const props = defineProps<ImageProps>();

const hasImage = computed(() => !!props.content?.image);
const isExternalLink = (link: string | undefined) => !!link && /^(https?:)?\/\//.test(link);
const linkTarget = computed(() => {
  const target = props.content?.image?.linktarget?.trim();
  if (!target) return undefined;
  return isExternalLink(target) ? target : localePath(target);
});
const linkTag = computed(() => (linkTarget.value ? NuxtLink : 'div'));
const ariaLabel = computed(() => props.content?.image?.alt || 'Image link');

const textContentProps = computed(() =>
  mapToTextContentProps({
    htmlDescription: props.content?.text.textOverlay,
    color: props.content?.text.textOverlayColor || '#000',
    textAlignment: props.content?.text.textOverlayAlignX ?? 'center',
    buttonLabel: props.content?.button.label,
    buttonLink: props.content?.button.link,
    buttonVariant: props.content?.button.variant,
  }),
);

const breakpointConfig = computed(() => {
  const image = props.content?.image;

  const configs: Record<string, BreakpointEntry> = {
    '4xl': {
      aspectRatio: image?.aspectRatio || '16 / 9',
      url: image?.wideScreen,
      dimensions: { width: 696, height: 392 },
    },
    lg: {
      aspectRatio: image?.aspectRatio || '16 / 9',
      url: image?.desktop,
      dimensions: { width: 712, height: 474 },
    },
    md: {
      aspectRatio: image?.aspectRatio || '4 / 3',
      url: image?.tablet,
      dimensions: { width: 757, height: 483 },
    },
    fallback: {
      aspectRatio: image?.aspectRatio || '1 / 1',
      url: image?.mobile,
      dimensions: { width: 320, height: 320 },
    },
  };

  return (configs[viewport.breakpoint.value] ?? configs['fallback']) as BreakpointEntry;
});

const depth = getBlockDepth(props.meta.uuid);
const wrapperStyle = computed(() => {
  if (depth > 0) {
    return {
      position: 'relative' as const,
      height: '24rem',
    };
  }

  return {
    aspectRatio: breakpointConfig.value.aspectRatio,
    position: 'relative' as const,
  };
});

const overlayAlignClasses = computed(() => {
  const alignY = props.content?.text.textOverlayAlignY;

  if (alignY === 'top') return ['justify-start'];
  if (alignY === 'bottom') return ['justify-end'];
  return ['justify-center'];
});

const imageInlineStyle = computed(() => {
  const layout = props.content.layout ?? {};
  return {
    paddingTop: `${layout.paddingTop ?? 0}px`,
    paddingBottom: `${layout.paddingBottom ?? 0}px`,
    paddingLeft: `${layout.paddingLeft ?? 0}px`,
    paddingRight: `${layout.paddingRight ?? 0}px`,
    backgroundColor: layout.backgroundColor ?? 'transparent',
  };
});
</script>
