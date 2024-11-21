<template>
  <ProductSlider v-if="showSlider" :items="products" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { RecommendedProductsProps } from '~/components/RecommendedProducts/types';

const props = defineProps<RecommendedProductsProps>();
const showSlider = ref(false);

watch(
  () => props.products,
  (updatedProducts) => {
    if (updatedProducts?.length) {
      showSlider.value = true;
    }
  },
  { immediate: true },
);
</script>
