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
        <UiBanner :banner-props="bannerItem" :index="index" />
      </SwiperSlide>
    </Swiper>

    <template #fallback>
      <UiBannerSkeleton />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper/modules';
import { BannerProps } from '../Banner/types';
const { onSlideChange } = useCarousel();

const { bannerItems } = defineProps<{
  bannerItems: BannerProps[];
}>();
const enableModules = computed(() => bannerItems.length > 1);
</script>

<style src="./styles/navigation.min.css"></style>
<style src="./styles/pagination.min.css"></style>
<style src="./styles/swiper.min.css"></style>
