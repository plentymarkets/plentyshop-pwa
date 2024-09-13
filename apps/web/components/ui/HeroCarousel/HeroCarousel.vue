<template>
  <CustomScrollable
    :buttons-placement="props.hero.length > 1 ? 'floating' : 'none'"
    class="pb-4"
    data-testid="product-slider"
  >
    <div class="absolute w-full h-full z-[-1] overflow-hidden">
      <img
        :src="props.background?.image"
        :width="getSizeForViewport(props.background?.sizes).width"
        :height="getSizeForViewport(props.background?.sizes).height"
        alt="Hero background"
        class="absolute top-0 left-0 w-full h-full object-cover"
      />
    </div>

    <div class="w-full max-w-[1536px] mx-auto px-4">
      <CustomScrollable
        :buttons-placement="props.hero.length > 1 ? 'block' : 'none'"
        :direction="'horizontal'"
        class="flex overflow-hidden &::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <div v-for="(item, index) in props.hero" :key="index" class="w-full flex-shrink-0">
          <HeroSlide :slide-data="item" />
        </div>
      </CustomScrollable>
    </div>
  </CustomScrollable>
</template>

<script setup lang="ts">
import { HeroCarouselProps, Size, Sizes } from '~/components/ui/HeroCarousel/types';
import HeroSlide from './HeroSlide.vue';
import CustomScrollable from '~/components/ui/CustomScrollable/CustomScrollable.vue';

const props = defineProps<HeroCarouselProps>();
const viewport = useViewport();
type SizeKey = keyof Sizes;

const getSizeForViewport = (sizes: Sizes | undefined): Size => {
  if (!sizes) return { width: '0', height: '0' };
  const breakpoint = viewport.breakpoint.value as SizeKey;

  return sizes[breakpoint] || { width: '0', height: '0' };
};
</script>
