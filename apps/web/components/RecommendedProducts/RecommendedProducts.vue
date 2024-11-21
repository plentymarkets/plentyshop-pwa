<template>
  <ProductSlider v-if="showProductSlider" :items="products" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { RecommendedProductsProps } from '~/components/RecommendedProducts/types';

const props = defineProps<RecommendedProductsProps>();
const showProductSlider = ref(false);

watch(
  () => props.products,
  (updatedProduct) => {
    showProductSlider.value = updatedProduct?.length ? true : false;
  },
  { immediate: true },
);
</script>
