<template>
  <ClientOnly>
    <Swiper
      :modules="enableModules ? [Pagination, Navigation] : []"
      :slides-per-view="1"
      :loop="true"
      pagination
      :navigation="
        enableModules
          ? {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }
          : false
      "
      @swiper="onSwiperInit"
      class="!z-0 !w-full !max-h-[85vh]"
    >
      <SwiperSlide v-for="(bannerItem, index) in bannerItems" :key="index">
        <UiBanner :banner-props="bannerItem" :index="index" />
      </SwiperSlide>
    </Swiper>

    <div
      v-if="enableModules && handleArrows()"
      class="swiper-button-prev"
      :style="{ color: generalTextColor + ' !important' }"
    ></div>
    <div
      v-if="enableModules && handleArrows()"
      class="swiper-button-next"
      :style="{ color: generalTextColor + ' !important' }"
    ></div>

    <template #fallback>
      <UiBannerSkeleton />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Navigation } from 'swiper/modules';
import { BannerProps } from '../Banner/types';

const { handleArrows } = useCarousel();
const { bannerItems } = defineProps<{ bannerItems: BannerProps[] }>();
const enableModules = computed(() => bannerItems.length > 1);

const generalTextColor = ref('inherit');

const onSwiperInit = () => {
  generalTextColor.value = bannerItems[0]?.text?.color ?? 'inherit';
};
</script>

<style src="./styles/navigation.min.css"></style>
<style src="./styles/pagination.min.css"></style>
<style src="./styles/swiper.min.css"></style>
