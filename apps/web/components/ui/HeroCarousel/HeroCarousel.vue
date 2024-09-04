<template>
  <SfScrollable
    buttons-placement="floating"
    class="s-f-scrollable flex overflow-hidden pb-4"
    data-testid="product-slider"
  >
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
        <div
          v-for="(item, index) in props.items"
          :key="index"
          class="min-w-full flex-shrink-0 flex md:flex-row md:items-center"
        >
          <div class="p-4 md:p-10 md:flex md:flex-col md:justify-center md:items-start flex-grow md:mr-4">
            <p class="typography-text-xs md:typography-text-sm font-bold tracking-widest text-neutral-500 uppercase">
              {{ item.subtitle }}
            </p>
            <h1 class="typography-display-2 md:typography-display-1 md:leading-[67.5px] font-bold mt-2 mb-4">
              {{ item.title }}
            </h1>
            <p class="typography-text-base md:typography-text-lg">
              {{ item.description }}
            </p>
            <div class="flex flex-col md:flex-row gap-4 mt-6">
              <UiButton size="lg">{{ item.primaryButtonText }}</UiButton>
            </div>
          </div>

          <div class="flex-shrink-0">
            <img
              :src="item.image"
              :width="getSizeForViewport(item.backgroundSizes).width"
              :height="getSizeForViewport(item.backgroundSizes).height"
              alt="Background"
              class="w-full h-auto object-cover"
            />
          </div>
        </div>
      </SfScrollable>
    </div>
  </SfScrollable>
</template>

<script setup lang="ts">
import { SfScrollable } from '@storefront-ui/vue';
import { HeroCarouselProps, Size } from '~/components/ui/HeroCarousel/types';
import { Sizes } from '~/components/ui/HeroCarousel/types';

const props = defineProps<HeroCarouselProps>();
const viewport = useViewport();

const { t } = useI18n();
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
.flex-grow {
  flex-grow: 1;
}
.s-f-scrollable {
  width: 100%; /* Ensure the scrollable component covers the full width */
}

.flex-shrink-0 {
  flex-shrink: 0; /* Prevent items from being compressed */
}
</style>
