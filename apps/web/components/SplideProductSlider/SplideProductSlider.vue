<template>
  <Splide :options="options" aria-labelledby="My Favorite Images" class="px-4 md:px-0">
    <SplideSlide v-for="product in recommendedProducts">
      <UiProductCard
        :product="product"
        :key="productGetters.getId(product)"
        :name="productGetters.getName(product)"
        :slug="productGetters.getSlug(product) + `-${productGetters.getId(product)}`"
        :image-url="addModernImageExtension(productGetters.getMiddleImage(product))"
        :image-alt="productGetters.getName(product)"
        :image-height="productGetters.getImageHeight(product) ?? 600"
        :image-width="productGetters.getImageWidth(product) ?? 600"
        :price="productGetters.getSpecialPrice(product)"
        :rating-count="productGetters.getTotalReviews(product)"
        :rating="productGetters.getAverageRating(product)" 
      />
    </SplideSlide>
  </Splide>
</template>
<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-sdk';
import type { SplideSliderProps } from '~/components/SplideProductSlider/types';
const props = defineProps<SplideSliderProps>();
const { addModernImageExtension, getImageForViewport } = useModernImage();
const { data: recommendedProducts, fetchProductRecommended } = useProductRecommended(props.categoryId + props.cacheKey);
if (props.categoryId) {
  fetchProductRecommended(props.categoryId);
}

const options = {
  fixedWidth: '220px',
  drag: 'free',
  mediaQuery: 'min',
  loop: false,
  arrows: false,
  pagination: false,
  gap: '30px',
  breakpoints: {
    768: {
      perPage: 3,
      fixedWidth: false,
      arrows: true,
    },
    992: {
      perPage: 4,
    },
  },
};
/*
const props = defineProps<SplideSliderProps>();
  console.log(props.categoryId)
if (props.categoryId) {
  //fetchProductRecommended(props.categoryId);
}*/
</script>
