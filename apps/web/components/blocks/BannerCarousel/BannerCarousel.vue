<template>
  <BlocksBannerCarouselHeroCarousel v-if="isHero" :banner-items="bannerItems" :index="index" :controls="controls" />
  <BlocksBannerCarouselBlazeCarousel v-else :banner-items="bannerItems" :index="index" :controls="controls" />
</template>

<script setup lang="ts">
import type { BannerProps } from '~/components/blocks/BannerCarousel/types';
import type { SlideControls } from '~/composables/useHomepage/types';

const runtimeConfig = useRuntimeConfig();
const isHero = ref(runtimeConfig.public.isHero);

const { bannerItems, index, controls } = defineProps<{
  bannerItems: BannerProps[];
  controls: SlideControls;
  index: number;
}>();
</script>
