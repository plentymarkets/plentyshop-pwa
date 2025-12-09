<template>
  <div class="w-full mt-10">
    <h3 class="font-bold mb-3">Last seen products</h3>
    <template v-if="products.length > 0">
      <ProductSlider :items="products" />
    </template>
    <template v-else-if="loading || products.length === 0">
      <SkeletonsProductSlider :items-count="5" />
    </template>
  </div>
</template>
<script setup lang="ts">
import { useLastSeen } from '../../composables/useLastSeen';
const { data, fetchLastSeenProducts, loading, itemsNotFetched } = useLastSeen();

const products = computed(() => {
  return Array.from(data.value.values());
});

onNuxtReady(() => {
  watch(
    [itemsNotFetched],
    () => {
      fetchLastSeenProducts(10);
    },
    {
      immediate: true,
    },
  );
});
</script>
