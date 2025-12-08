<template>
    <div class="w-full mt-10">
        <template v-if="products.length > 0" class="w-full mt-10">
            <h3 class="font-bold mb-3">Last seen products</h3>
            <ProductSlider :items="products"></ProductSlider>
            <UiButton v-if="totalPages > 1" @click="nextPage()">load more</UiButton>
        </template>
        <template v-else-if="loading">
            <p>Loading...</p>
        </template>
    </div>
</template>
<script setup lang="ts">
import { useLastSeen } from '../../composables/useLastSeen';
const { data, fetchLastSeenProducts, nextPage, loading, itemsNotFetched, totalPages, page } = useLastSeen();

const products = computed(() => {
    return Array.from(data.value.values());
});

onNuxtReady(() => {
    watch([itemsNotFetched, page], () => {
        fetchLastSeenProducts(10);
    }, {
        immediate: true
    })
});


</script>