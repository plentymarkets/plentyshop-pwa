<template>
  <NuxtImg
    :src="getImageUrl()"
    :alt="props.bannerProps.image.alt ?? ''"
    class="h-[85vh] w-full object-cover"
    :style="{ filter: 'brightness(' + props.bannerProps.image.brightness + ')' }"
  />

  <div
    class="absolute inset-0 p-4 md:p-10 flex flex-col md:basis-2/4"
    :style="{
      color: props.bannerProps.text.color,
      textAlign: getTextAlignment(),
      alignItems: getContentPosition(props.bannerProps.text.align),
      justifyContent: getContentPosition(props.bannerProps.text.justify),
    }"
  >
    <div
      class="p-4 md:p-6 rounded-lg md:max-w-[50%]"
      :style="{ backgroundColor: props.bannerProps.text.bgcolor, opacity: props.bannerProps.text.bgopacity }"
    >
      <div class="typography-headline-6 font-bold tracking-widest uppercase" data-testid="pretitle">
        {{ props.bannerProps.text.pretitle }}
      </div>

      <h1 class="typography-display-1 md:leading-[67.5px] font-bold my-2" data-testid="title">
        {{ props.bannerProps.text.title }}
      </h1>

      <div class="typography-headline-6 font-bold tracking-widest mb-4" data-testid="subtitle">
        {{ props.bannerProps.text.subtitle }}
      </div>

      <div
        v-html="props.bannerProps.text.htmlDescription"
        class="typography-text-sm md:typography-text-lg font-normal"
        data-testid="description"
      ></div>

      <UiButton
        class="flex flex-col md:flex-row gap-4 mt-6"
        :tag="NuxtLink"
        :to="localePath(props.bannerProps.button.link ?? '')"
        :variant="props.bannerProps.button.variant ?? 'primary'"
        size="lg"
      >
        {{ props.bannerProps.button.label }}
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BannerProps } from './types';

const NuxtLink = resolveComponent('NuxtLink');

const localePath = useLocalePath();

const viewport = useViewport();
const isMobile = computed(() => viewport.isLessThan('lg'));

const props = defineProps<{
  bannerProps: BannerProps;
}>();

const getImageUrl = () => {
  switch (viewport.breakpoint.value) {
    case 'lg': {
      return props.bannerProps.image.lg;
    }
    case 'md': {
      return props.bannerProps.image.md;
    }
    case 'sm': {
      return props.bannerProps.image.sm;
    }
    default: {
      return props.bannerProps.image.xs;
    }
  }
};

const getTextAlignment = () => {
  if (isMobile.value) {
    return 'center';
  }

  switch (props.bannerProps.text.textAlignment) {
    case 'center': {
      return 'center';
    }
    case 'right': {
      return 'right';
    }
    default: {
      return 'left';
    }
  }
};

const getContentPosition = (axis: string) => {
  if (isMobile.value) {
    return 'center';
  }

  switch (axis) {
    case 'center': {
      return 'center';
    }
    case 'end': {
      return 'flex-end';
    }
    default: {
      return 'flex-start';
    }
  }
};
</script>
