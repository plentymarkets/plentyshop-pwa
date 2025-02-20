<template>
  <BlocksBannerCarouselHeroCarousel v-if="true" :content="content" :index="index" :controls="controls" />
<!--  <BlocksBannerCarouselBlazeCarousel v-else :banner-items="bannerItems" :index="index" :controls="controls" />-->
</template>

<script setup lang="ts">
import type { BannerProps } from '~/components/blocks/BannerCarousel/types';
import type { SlideControls } from '~/composables/useHomepage/types';

const runtimeConfig = useRuntimeConfig();
const isHero = ref(runtimeConfig.public.isHero);

const { content, index, controls } = defineProps<{
  content: BannerProps[];
  controls: SlideControls;
  index: number;
}>();

console.log('content banner carousel: ', content);
</script>
