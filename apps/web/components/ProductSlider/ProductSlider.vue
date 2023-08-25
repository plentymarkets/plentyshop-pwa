<template>
  <SfScrollable buttons-placement="floating" class="pb-4" :wrapper-class="wrapperClass" data-testid="product-slider">
    <UiProductCard
      v-for="product in items"
      :product="product"
      :key="productGetters.getId(product)"
      class="max-w-[192px]"
      :name="productGetters.getName(product)"
      :slug="productGetters.getSlug(product)"
      :image-url="productGetters.getCoverImage(product)"
      :image-alt="productGetters.getName(product)"
      :price="productGetters.getSpecialPrice(product)"
      :rating-count="productGetters.getTotalReviews({} as ReviewAverage)"
      :rating="productGetters.getAverageRating({} as ReviewAverage)"
    />
  </SfScrollable>
</template>

<script setup lang="ts">
import { ReviewAverage } from '@plentymarkets/plentymarkets-sdk/packages/api-client/server';
import { productGetters } from '@plentymarkets/plentymarkets-sdk/packages/sdk/src';
import { SfScrollable } from '@storefront-ui/vue';
import type { ProductSliderProps } from '~/components/ProductSlider/types';

defineProps<ProductSliderProps>();
</script>
