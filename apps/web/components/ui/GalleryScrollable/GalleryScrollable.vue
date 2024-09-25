<template>
  <div class="relative max-h-[600px] flex flex-col w-full aspect-[4/3] gap-1">
    <SfScrollable
      class="w-full h-full snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      :active-index="activeIndex"
      wrapper-class="h-full group/scrollable"
      is-active-index-centered
      :previous-disabled="activeIndex === 0"
      :next-disabled="activeIndex === hero.length - 1"
      buttons-placement="block"
      @on-prev="activeIndex -= 1"
      @on-next="activeIndex += 1"
    >
      <template #previousButton="defaultProps">
        <SfButton
          v-bind="defaultProps"
          :disabled="activeIndex === 0"
          class="absolute hidden group-hover/scrollable:block disabled:!hidden !rounded-full !p-3 z-10 top-1/2 left-4 bg-white"
          variant="secondary"
          size="lg"
          square
        >
          <SfIconChevronLeft />
        </SfButton>
      </template>

      <div
        v-for="(item, index) in hero"
        :key="index"
        class="carousel-div relative min-h-[600px] flex justify-center basis-full snap-center snap-always shrink-0 grow"
      >
        <div class="absolute w-full h-full z-[-1] overflow-hidden">
          <img
            :src="background.image"
            :width="getSizeForViewport(background.sizes).width"
            :height="getSizeForViewport(background.sizes).height"
            :alt="item.heading"
            class="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>
        <div class="md:flex md:flex-row-reverse md:justify-center max-w-[1536px] mx-auto md:min-h-[600px]">
          <div class="flex flex-col md:basis-2/4 md:items-stretch md:overflow-hidden">
            <img :src="item.image" :alt="item.heading" class="h-full object-cover object-left" />
          </div>
          <div class="p-4 md:p-10 md:max-w-[768px] md:flex md:flex-col md:justify-center md:items-start md:basis-2/4">
            <p class="typography-text-xs md:typography-text-sm font-bold tracking-widest text-neutral-500 uppercase">
              {{ item.tagline }}
            </p>
            <h1 class="typography-display-2 md:typography-display-1 md:leading-[67.5px] font-bold mt-2 mb-4">
              {{ item.heading }}
            </h1>
            <p class="typography-text-base md:typography-text-lg">
              {{ item.description }}
            </p>
            <div class="flex flex-col md:flex-row gap-4 mt-6">
              <UiButton size="lg"> {{ item.callToAction }} </UiButton>
            </div>
          </div>
        </div>
      </div>

      <template #nextButton="defaultProps">
        <SfButton
          v-bind="defaultProps"
          :disabled="activeIndex === hero.length - 1"
          class="absolute hidden group-hover/scrollable:block disabled:!hidden !rounded-full !p-3 z-10 top-1/2 right-4 bg-white"
          variant="secondary"
          size="lg"
          square
        >
          <SfIconChevronRight />
        </SfButton>
      </template>
    </SfScrollable>
    <div class="flex-shrink-0 basis-auto">
      <div
        class="flex-row w-full flex gap-0.5 mt justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] md:hidden"
      >
        <button
          v-for="index in hero.length"
          :key="`${index}-bullet`"
          :aria-current="activeIndex === index - 1"
          :aria-label="'Slide ' + index"
          :class="[
            'mx-2 w-4 h-4 rounded-full mt-1 border-4 transition-colors focus-visible:outline focus-visible:outline-offset-0 pointer-events-none',
            activeIndex === index - 1 ? 'border-primary-700 bg-primary-700' : 'border-gray-200 bg-gray-200',
          ]"
          @click="activeIndex = index - 1"
          @scroll="activeIndex = index - 1"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SfScrollable, SfButton, SfIconChevronLeft, SfIconChevronRight } from '@storefront-ui/vue';
import { ref, PropType } from 'vue';

interface HeroItem {
  image: string;
  tagline: string;
  heading: string;
  description: string;
  callToAction: string;
  link: string;
}

interface Background {
  image: string;
  sizes: {
    lg: {
      width: string;
      height: string;
    };
    md: {
      width: string;
      height: string;
    };
    sm: {
      width: string;
      height: string;
    };
  };
}
const viewport = useViewport();

const props = defineProps({
  hero: {
    type: Array as PropType<HeroItem[]>,
    required: true,
  },
  background: {
    type: Object as PropType<Background>,
    required: true,
  },
});

const activeIndex = ref(0);

export type Size = {
  width: string;
  height: string;
};

export type Sizes = {
  lg: Size;
  md: Size;
  sm: Size;
};

type SizeKey = keyof Sizes;

const getSizeForViewport = (sizes: Sizes | undefined): Size => {
  if (!sizes) return { width: '0', height: '0' };
  const breakpoint = viewport.breakpoint.value as SizeKey;

  return sizes[breakpoint] || { width: '0', height: '0' };
};
</script>
