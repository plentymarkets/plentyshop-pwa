<template>
  <NuxtImg
    :src="getImageUrl()"
    :alt="props.heroItemProps.image.alt ?? ''"
    class="h-[85vh] w-full object-cover"
    :style="{ filter: 'brightness(' + props.heroItemProps.image.brightness + ')' }"
  />

  <div
    class="absolute inset-0 p-4 md:p-10 flex flex-col md:basis-2/4"
    :style="{
      color: props.heroItemProps.text.color,
      textAlign: getTextAlignment(),
      alignItems: getContentPosition(props.heroItemProps.text.align),
      justifyContent: getContentPosition(props.heroItemProps.text.justify),
    }"
  >
    <div
      class="p-4 md:p-6 rounded-lg md:max-w-[50%]"
      :style="{ backgroundColor: props.heroItemProps.text.bgcolor, opacity: props.heroItemProps.text.bgopacity }"
    >
      <div class="typography-text-xs md:typography-text-sm font-bold tracking-widest uppercase" data-testid="pretitle">
        {{ props.heroItemProps.text.pretitle }}
      </div>

      <h2
        class="typography-display-3 md:typography-display-1 md:leading-[67.5px] font-bold text-xs mt-2 mb-4"
        data-testid="title"
      >
        {{ props.heroItemProps.text.title }}
      </h2>

      <h2 class="typography-display-4 md:typography-display-3 font-bold text-xs mt-2" data-testid="subtitle">
        {{ props.heroItemProps.text.subtitle }}
      </h2>

      <div
        v-if="props.heroItemProps.text.descriptionIsHtml"
        v-html="props.heroItemProps.text.description"
        data-testid="description"
      ></div>
      <div v-else class="typography-text-sm md:typography-text-lg font-normal" data-testid="description">
        {{ props.heroItemProps.text.description }}
      </div>

      <UiButton
        class="flex flex-col md:flex-row gap-4 mt-6"
        :tag="NuxtLink"
        :to="localePath(props.heroItemProps.button.link ?? '')"
        :variant="props.heroItemProps.button.variant ?? 'primary'"
        size="lg"
      >
        {{ props.heroItemProps.button.label }}
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HeroContentProps2 } from '../HeroCarousel/types';

const NuxtLink = resolveComponent('NuxtLink');

const localePath = useLocalePath();

const viewport = useViewport();
const isMobile = computed(() => viewport.isLessThan('lg'));

const props = defineProps<{
  heroItemProps: HeroContentProps2;
}>();

const getImageUrl = () => {
  switch (viewport.breakpoint.value) {
    case 'lg': {
      return props.heroItemProps.image.lg;
    }
    case 'md': {
      return props.heroItemProps.image.md;
    }
    case 'sm': {
      return props.heroItemProps.image.sm;
    }
    default: {
      return props.heroItemProps.image.xs;
    }
  }
};

const getTextAlignment = () => {
  if (isMobile.value) {
    return 'center';
  }

  switch (props.heroItemProps.text.textAlignment) {
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
