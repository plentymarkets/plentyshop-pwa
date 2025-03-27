<template>
  <div class="block-slider-edit">
    <div :data-testid="`slide-settings-${activeSlide}`">
      <BannerImagesSettings :banner="banner" @clampBrightness="onClampBrightness" />
      <BannerTextSettings :banner="banner" @clampBrightness="onClampBrightness" />
      <BannerButtonSettings :banner="banner" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { clamp } from '@storefront-ui/shared';

import BannerImagesSettings from './BannerImagesSettings.vue';
import BannerTextSettings from './BannerTextSettings.vue';
import BannerButtonSettings from './BannerButtonSettings.vue';

import type { BannerFormProps, BannerProps } from './types';

const { blockUuid } = useSiteConfiguration();
const { activeSlideIndex } = useCarousel();
const { data } = useCategoryTemplate();
const { findOrDeleteBlockByUuid } = useBlockManager();

const props = defineProps<BannerFormProps>();
const activeSlide = computed(() => activeSlideIndex.value[props.uuid || blockUuid.value]);

const banner = computed(
  () => (findOrDeleteBlockByUuid(data.value, props.uuid || blockUuid.value) || {}) as BannerProps,
);

const onClampBrightness = (value: number, type: string) => {
  if (type === 'image') {
    banner.value.content.image.brightness = clamp(value, 0, 1);
  } else if (type === 'text') {
    banner.value.content.text.bgopacity = clamp(value, 0, 1);
  }
}
</script>
