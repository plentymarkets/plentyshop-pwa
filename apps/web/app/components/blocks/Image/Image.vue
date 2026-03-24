<template>
  <div class="relative w-full flex justify-center" :style="wrapperStyle" data-testid="image-block">
    <component
      :is="linkTag"
      v-if="hasImage"
      :to="linkTarget"
      :aria-label="ariaLabel"
      v-bind="isExternalLink(linkTarget) ? { target: '_blank', rel: 'noopener' } : {}"
      data-testid="image-link"
    >
      <NuxtImg
        :src="getImageUrl()"
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
        :width="getImageDimensions().width"
        :height="getImageDimensions().height"
        data-testid="image-block-image"
      />
    </component>
    <div class="absolute inset-0 px-4 flex flex-col" :class="overlayAlignClasses" data-testid="image-overlay-wrapper">
      <TextContent v-bind="textContentProps" :test-id="'image-overlay'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ImageProps, ImageDimensions } from './types';

const viewport = useViewport();
const NuxtLink = resolveComponent('NuxtLink');
const localePath = useLocalePath();
const { getBlockDepth } = useBlockManager();

const props = defineProps<ImageProps>();

const hasImage = computed(() => !!props.content?.image);
const linkTarget = computed(() =>
  props.content?.image?.linktarget?.trim() ? localePath(props.content.image.linktarget) : undefined,
);
const linkTag = computed(() => (linkTarget.value ? NuxtLink : 'div'));
const ariaLabel = computed(() => props.content?.image?.alt || 'Image link');

const isExternalLink = (link: string | undefined) => !!link && /^(https?:)?\/\//.test(link);

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

const depth = getBlockDepth(props.meta.uuid);
const wrapperStyle = computed(() => {
  if (depth > 0) {
    return {
      position: 'relative' as const,
      height: '24rem',
    };
  }
  return {
    aspectRatio: getAspectRatio(),
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
      ? 'justify-start'
      : props.content?.text.textOverlayAlignY === 'bottom'
        ? 'justify-end'
        : 'justify-center';

  return [vertical];
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
