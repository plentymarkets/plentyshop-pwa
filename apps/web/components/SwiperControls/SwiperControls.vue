<template>
  <button @click="swiper.slideNext()">Next</button>
  <button @click="swiper.slidePrev()">Previous</button>
</template>

<script setup lang="ts">
const swiper = useSwiper();
</script>
