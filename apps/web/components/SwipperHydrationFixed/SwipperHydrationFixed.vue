<template>
  <div>
    <button :class="{ 'opacity-100 !visible': showPrevBtn }" type="button" aria-label="slide left" @click="slidePrev">
      Arrow Left
    </button>

    <ClientOnly>
      <template #fallback> Loading... </template>
      <swiper-container ref="slider" init="false" @init="onSliderInit">
        <swiper-slide
          v-for="(slide, idx) in slides"
          :key="idx"
          :style="`background-color: ${slide.bg}; color: ${slide.color}`"
        >
          <div>
            {{ idx }}
          </div>
        </swiper-slide>
      </swiper-container>
    </ClientOnly>

    <button :class="{ 'opacity-100 !visible': showNextBtn }" type="button" aria-label="slide right" @click="slideNext">
      Arrow Right
    </button>
  </div>
</template>

<script setup>
import { register } from 'swiper/element';
const slides = ref(
  Array.from({ length: 10 }, () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    // Figure out contrast color for font
    const contrast = r * 0.299 + g * 0.587 + b * 0.114 > 186 ? 'black' : 'white';

    return { bg: `rgb(${r}, ${g}, ${b})`, color: contrast };
  }),
);
const slider = ref();
const showPrevBtn = ref(false);
const showNextBtn = ref(false);

register();

const onSliderInit = (e) => {
  const [swiper] = e.detail;

  showPrevBtn.value = !swiper.isBeginning;
  showNextBtn.value = !swiper.isEnd;
};

const slidePrev = () => {
  slider.value?.swiper.slidePrev();
};

const slideNext = () => {
  slider.value?.swiper.slideNext();
};

onMounted(async () => {
  const params = {
    slidesPerView: 'auto',
    on: {
      slideChange() {
        console.log('slide changed');
      },
    },
  };

  await nextTick(() => {
    Object.assign(slider.value, params);
    slider.value.initialize();
  });
});
</script>
<style>
.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  height: 20vh;
  font-size: 4rem;
  font-weight: bold;
  font-family: 'Roboto', sans-serif;
}
.swiper-wrapper {
  min-width: 100vh;
  width: 100vh;
}
.swiper-cards {
  width: 240px;
  height: 240px;
}
.swiper-cards .swiper-slide {
  border-radius: 6px;
  border: 1px solid black;
}
</style>
