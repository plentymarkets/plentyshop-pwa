<template>
  <div>
    <Swiper
      :modules="[SwiperAutoplay, SwiperPagination]"
      :slides-per-view="1"
      :loop="true"
      :autoplay="{
        delay: 3000,
        disableOnInteraction: false,
      }"
      :style="`background-color: red`"
      pagination
    >
      <SwiperSlide v-if="slides.length > 0">
        <h3>{{ slides[0].title }}</h3>
        <p>{{ slides[0].description }}</p>
      </SwiperSlide>

      <SwiperSlide
        v-for="(slide, idx) in remainingSlides"
        :key="idx"
        :style="`background-color: ${slide.bg}; color: ${slide.color}`"
      >
        <h3>{{ slide.title }}</h3>
        <p>{{ slide.description }}</p>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';

const slides = ref([
  { title: 'Slide 1', description: 'This is the first slide', bg: 'red', color: 'black' },
  { title: 'Slide 2', description: 'This is the second slide', bg: '#c1c1c1', color: 'white' },
  { title: 'Slide 3', description: 'This is the third slide', bg: '#a1a1a1', color: 'white' },
  { title: 'Slide 4', description: 'This is the fourth slide', bg: '#818181', color: 'white' },
]);

const remainingSlides = ref([]);

onMounted(() => {
  remainingSlides.value = slides.value.slice(1);
});
</script>

<style>
.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  text-align: center;
}
</style>
