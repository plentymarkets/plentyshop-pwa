<template>
  <SfScrollable
    buttons-placement="floating"
    class="pb-4 scrollbar-hidden"
    :wrapper-class="wrapperClass"
    data-testid="product-slider"
  >
    <UiProductCard
      v-for="product in items"
      :product="product"
      :key="productGetters.getId(product)"
      :name="productGetters.getName(product)"
      :slug="productGetters.getSlug(product) + `-${productGetters.getId(product)}`"
      :image-url="addModernImageExtension(productGetters.getSecondPreviewImage(product))"
      :image-alt="productGetters.getName(product)"
      :image-height="productGetters.getImageHeight(product) ?? 600"
      :image-width="productGetters.getImageWidth(product) ?? 600"
      :price="productGetters.getSpecialPrice(product)"
      :rating-count="productGetters.getTotalReviews(product)"
      :rating="productGetters.getAverageRating(product, 'half')"
      is-from-slider
      class="max-w-48"
    />
  </SfScrollable>
  <div class="mt-4 typography-text-xs flex gap-1">
    <span>{{ $t('asterisk') }}</span>
    <span v-if="showNetPrices">{{ $t('itemExclVAT') }}</span>
    <span v-else>{{ $t('itemInclVAT') }}</span>
    <span>{{ $t('excludedShipping') }}</span>
  </div>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import { SfScrollable } from '@storefront-ui/vue';
import type { ProductSliderProps } from '~/components/ProductSlider/types';

const { addModernImageExtension } = useModernImage();
const runtimeConfig = useRuntimeConfig();
const showNetPrices = runtimeConfig.public.showNetPrices;

defineProps<ProductSliderProps>();
</script>
