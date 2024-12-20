<template>
  <section class="kl-collection-hero">
    <div class="kl-collection-hero__content">
      <div class="kl-collection-hero__category">Breakfast</div>
      <h1 class="kl-collection-hero__title">{{ categoryName }}</h1>
      <img>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const { categoryName } = defineProps({
  categoryName: String
});

let imageName = '';
if (categoryName == "Pringles") imageName = 'pringles'
if (categoryName == "Cerealien") imageName = 'cerealien'
if (categoryName == "Müsli") imageName = 'musli'
if (categoryName == "Poptarts") imageName = 'pop-tarts'

const bgImage = computed(() => `url('/images/kelloggs/hero/${imageName}.png')`);
const bgImageHover = computed(() => `url('/images/kelloggs/hero/${imageName}-hover.png')`);
const bgImageMob = computed(() => `url('/images/kelloggs/hero/${imageName}-mob.png')`);
const allImages = computed(() => `url('/images/kelloggs/hero/${imageName}.png') url('/images/kelloggs/hero/${imageName}-hover.png')`);

const bgColor = computed(() => {
  if (categoryName == "Pringles") return '#F60B45';
  if (categoryName == "Cerealien") return '#0054d2';
  if (categoryName == "Müsli") return '#ffb925';
  if (categoryName == "Poptarts") return '#0054d2';

  return '#F60B45';
});
</script>

<style lang="scss" scoped>
.kl-collection-hero {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 360px;
  color: #fff;
  background-color: v-bind(bgColor);
}

// Preload images to avoid flicker of red background color on first hover
@media only screen and (min-width: 768px) {
  .kl-collection-hero::after {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    z-index: -1; // hide images
    content: v-bind(allImages);
  }
}

.kl-collection-hero__content {
  z-index: 2;
}

.kl-collection-hero__title {
  display: block;
  color: white;
  font-size: 80px;
  font-weight: 800;
  margin: 0;
  line-height: 1;
}

.kl-collection-hero__category {
  font-size: 18px;
  font-weight: 800;
  margin: 0;
}

@media (min-width: 768px) {
  .kl-collection-hero {
    background-image: v-bind(bgImage);
    background-size: cover;
    background-position: center;
    transition: background-image 0.3s ease;
  }

  .kl-collection-hero:hover {
    background-image: v-bind(bgImageHover);
  }
}

@media (max-width: 767px) {
  .kl-collection-hero {
    background-image: v-bind(bgImageMob);
    background-size: cover;
    background-position: center;
    height: 225px;
  }

  .kl-collection-hero__title {
    font-size: 40px;
  }

  .kl-collection-hero__category {
    font-size: 16px;
  }
}
</style>