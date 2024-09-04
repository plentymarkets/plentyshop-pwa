<template>
  <SfScrollable buttons-placement="floating" class="pb-4 overflow-hidden" data-testid="product-slider">
    <div class="absolute w-full h-full z-[-1]">
      <img
        :src="props.background?.image"
        :width="getSizeForViewport(props.background?.sizes).width"
        :height="getSizeForViewport(props.background?.sizes).height"
        alt="Hero background"
        class="absolute top-0 left-0 w-full h-full object-cover"
      />
    </div>

    <div class="max-w-[1536px] mx-auto">
      <SfScrollable :buttons-placement="'block'" :direction="'horizontal'" class="flex overflow-hidden">
        <div v-for="(item, index) in props.items" :key="index" class="min-w-full flex-shrink-0">
          <HeroSlide :slideData="item" />
        </div>
      </SfScrollable>
    </div>
  </SfScrollable>
</template>

<script setup lang="ts">
import { SfScrollable } from '@storefront-ui/vue';
import { HeroCarouselProps, Size, Sizes } from '~/components/ui/HeroCarousel/types';
import HeroSlide from './HeroSlide.vue';

const props = defineProps<HeroCarouselProps>();
const viewport = useViewport();
type SizeKey = keyof Sizes;

const getSizeForViewport = (sizes: Sizes | undefined): Size => {
  if (!sizes) return { width: '0', height: '0' };
  const breakpoint = viewport.breakpoint.value as SizeKey;

  return sizes[breakpoint] || { width: '0', height: '0' };
};
</script>

<style scoped>
.w-full {
  display: flex;
  justify-content: center;
  align-items: center;
}

.overflow-hidden {
  overflow: hidden;
}
</style>
