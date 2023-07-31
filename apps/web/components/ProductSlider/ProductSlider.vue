<template>
  <SfScrollable
    buttons-placement="floating"
    class="items-center pb-4"
    :wrapper-class="wrapperClass"
    data-testid="product-slider"
  >
    <UiProductCard
      v-for="product in items"
      :key="productGetters.getId(product)"
      class="max-w-[192px]"
      :name="productGetters.getName(product)"
      :slug="productGetters.getSlug(product)"
      :image-url="productGetters.getCoverImage(product)"
      :image-alt="productGetters.getName(product)"
      :price="productGetters.getSpecialPrice(product)"
      :rating-count="productGetters.getTotalReviews(product)"
      :rating="productGetters.getAverageRating(product)"
    />
  </SfScrollable>
</template>

<script setup lang="ts">
import { productGetters } from '../../../../../plentymarkets-sdk/packages/sdk/src/index';
import { SfScrollable } from '@storefront-ui/vue';
import type { ProductSliderProps } from '~/components/ProductSlider/types';

defineProps<ProductSliderProps>();
</script>
