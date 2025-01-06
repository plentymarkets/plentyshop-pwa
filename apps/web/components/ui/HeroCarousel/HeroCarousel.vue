<template>
  <ClientOnly>
    <Swiper
      :modules="enableModules ? [Pagination] : []"
      :slides-per-view="1"
      :loop="true"
      pagination
      @slide-change="onSlideChange"
      class="!z-0 !w-full !max-h-[85vh]"
    >
      <!-- <SwiperSlide v-for="(heroItem, index) in hero" :key="index">
        <UiHeroContent :hero-item-props="heroItem" />
      </SwiperSlide> -->

      <SwiperSlide>
        <UiBanner :banner-props="heroContent2" :index="0" />
      </SwiperSlide>
    </Swiper>

    <template #fallback>
      <UiBannerSkeleton />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { HeroContentProps } from './types';
import { Pagination } from 'swiper/modules';
import { BannerProps } from '../Banner/types';
const { onSlideChange } = useCarousel();

const { hero } = defineProps<{
  hero: HeroContentProps[];
}>();
const enableModules = computed(() => hero.length > 1);

const heroContent2: BannerProps = {
  image: {
    lg: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/background-carousel.png',
    md: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/background-carousel-768.png',
    sm: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/background-carousel-480.png',
    xs: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/background-carousel-480.png',
    alt: '',
    brightness: 0.5,
  },
  text: {
    color: '#fff',
    bgcolor: '#000',
    bgopacity: 0.8,
    pretitle: 'Pretitle',
    title: 'Title',
    subtitle: 'Subtitle',
    htmlDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat',
    textAlignment: 'left',
    justify: 'end',
    align: 'center',
  },
  button: {
    label: 'Test',
    link: '/test',
    variant: 'primary',
  },
};
</script>

<style src="./styles/navigation.min.css"></style>
<style src="./styles/pagination.min.css"></style>
<style src="./styles/swiper.min.css"></style>
