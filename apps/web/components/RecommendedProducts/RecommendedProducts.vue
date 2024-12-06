<template>
  <p
    v-if="headline"
    data-testid="recommended-products-headline"
    class="mb-4 typography-text-lg text-center md:text-left"
  >
    {{ headline }}
  </p>
  <ProductSlider v-if="products?.length" :items="products" />
</template>

<script setup lang="ts">
import type { RecommendedProductsProps } from '~/components/RecommendedProducts/types';

defineProps<RecommendedProductsProps>();
</script>
