<template>
  <ClientOnly>
    <Swiper
      :modules="enableModules ? [Pagination] : []"
      :slides-per-view="1"
      :loop="true"
      pagination
      @slide-change="onSlideChange"
      class="!z-0"
    >
      <!-- <SwiperSlide v-for="(heroItem, index) in hero" :key="index" class="md:px-7 lg:px-15">
        <UiHeroContent :hero-item-props="heroItem" />
      </SwiperSlide> -->

      <SwiperSlide>
         <img
            src="https://cdn02.plentymarkets.com/mevofvd5omld/frontend/background-carousel.png"
            class="h-auto w-full object-cover brightness-50"
            alt=""
          />
          <div
            class="absolute inset-0 p-4 md:p-10 md:max-w-[50%] md:flex md:flex-col md:justify-center md:items-start md:basis-2/4 text-white"
          >
            <p
              class="typography-text-xs md:typography-text-sm font-bold tracking-widest uppercase"
              data-testid="tagline"
            >
              Tagline
            </p>
            <h1
              class="typography-display-3 md:typography-display-1 md:leading-[67.5px] font-bold text-xs text-center md:text-left mt-2 mb-4"
              data-testid="headline"
            >
              Heading
            </h1>
            <p
              class="typography-text-sm md:typography-text-lg text-center md:text-left font-normal"
              data-testid="description"
            >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut lacinia mauris ipsum, faucibus pretium magna congue non. Donec ut rutrum magna, quis molestie felis. Duis mattis vel odio consectetur sagittis. Cras vel diam suscipit, ornare risus nec, pellentesque risus. Pellentesque ac placerat risus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dictum placerat egestas. Fusce varius viverra lacus ut sodales. Sed imperdiet nec nunc ut congue. Duis ac nisl ipsum. In hac habitasse platea dictumst.
            </p>
            <div class="flex flex-col md:flex-row gap-4 mt-6">
              <UiButton size="lg">Test</UiButton>
            </div>
          </div>
      </SwiperSlide>
    </Swiper>

    <template #fallback>
      <UiHeroContentSkeleton />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { HeroContentProps } from './types';
import { Pagination } from 'swiper/modules';
const { onSlideChange } = useCarousel();

const { hero } = defineProps<{
  hero: HeroContentProps[];
}>();
const enableModules = computed(() => hero.length > 1);
</script>

<style src="./styles/navigation.min.css"></style>
<style src="./styles/pagination.min.css"></style>
<style src="./styles/swiper.min.css"></style>
