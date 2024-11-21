<template>
  <ProductSlider v-show="products?.length" :items="products" />
  !
</template>

<script setup lang="ts">
import type { RecommendedProductsProps } from '~/components/RecommendedProducts/types';

defineProps<RecommendedProductsProps>();
</script>
