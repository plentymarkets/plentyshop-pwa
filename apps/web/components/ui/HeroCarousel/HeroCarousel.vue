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
      <SwiperSlide v-for="(bannerItem, index) in bannerItems" :key="index">
        <UiBanner :banner-props="bannerItem" :index="0" />
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

const bannerItems: BannerProps[] = [
  {
    image: {
      desktop: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Person/guy-1024.avif',
      tablet: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Person/guy-768.avif',
      mobile: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Person/guy-320.avif',
      alt: '',
      brightness: 0.5,
    },
    text: {
      color: '#fff',
      bgcolor: '#000',
      bgopacity: 0.8,
      pretitle: 'PRETITLE',
      title: 'Title',
      subtitle: 'Subtitle',
      htmlDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat',
      textAlignment: 'left',
      justify: 'center',
      align: 'center',
    },
    button: {
      label: 'Test',
      link: '/test',
      variant: 'primary',
    },
  },
  {
    image: {
      desktop: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Drone/drone-A-1024.avif',
      tablet: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Drone/drone-A-768.avif',
      mobile: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Drone/drone-A-320.avif',
      alt: '',
      brightness: 0.75,
    },
    text: {
      color: '#fff',
      bgcolor: '#000',
      bgopacity: 0.8,
      pretitle: 'PRETITLE',
      title: 'Title',
      subtitle: 'Subtitle',
      htmlDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat',
      textAlignment: 'left',
      justify: 'center',
      align: 'center',
    },
    button: {
      label: 'Test',
      link: '/test',
      variant: 'primary',
    },
  },
];
</script>

<style src="./styles/navigation.min.css"></style>
<style src="./styles/pagination.min.css"></style>
<style src="./styles/swiper.min.css"></style>
