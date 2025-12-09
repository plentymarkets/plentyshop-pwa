<template>
    <h3 class="font-bold mb-3">Last seen products</h3>
    <div class="w-full mt-10">
        <template v-if="products.length > 0">
            <ProductSlider :items="products"></ProductSlider>
        </template>
        <template v-else-if="loading">
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
    watch([itemsNotFetched], () => {
        fetchLastSeenProducts(10);
    }, {
        immediate: true
    })
});


</script>