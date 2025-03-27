<template>
  <div class="block-slider-edit">
    <div :data-testid="`slide-settings-${activeSlideIndex}`">
      <BannerImagesSettings :banner="banner" @clamp-brightness="onClampBrightness" />
      <BannerTextSettings :banner="banner" @clamp-brightness="onClampBrightness" />
      <BannerButtonSettings :banner="banner" />
    </div>
  </div>
</template>

<script setup lang="ts">
import BannerImagesSettings from './BannerImagesSettings.vue';
import BannerTextSettings from './BannerTextSettings.vue';
import BannerButtonSettings from './BannerButtonSettings.vue';
import { computed } from 'vue';
import type { BannerFormProps, BannerProps } from './types';
import { clamp } from '@storefront-ui/shared';

const props = defineProps<BannerFormProps>();
const { blockUuid } = useSiteConfiguration();
const { data } = useCategoryTemplate();
const { findOrDeleteBlockByUuid } = useBlockManager();

const banner = computed(
  () => (findOrDeleteBlockByUuid(data.value, props.uuid || blockUuid.value) || {}) as BannerProps,
);

const onClampBrightness = (value: number, type: string) => {
  if (type === 'image') {
    banner.value.content.image.brightness = clamp(value, 0, 1);
  } else if (type === 'text') {
    banner.value.content.text.bgopacity = clamp(value, 0, 1);
  }
};
</script>
