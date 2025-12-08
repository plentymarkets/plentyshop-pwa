<template>
    <div v-if="products.length > 0" class="w-full">
        <h3 class="font-bold mb-3">Last seen products</h3>
        <ProductSlider :items="products" />
        <UiButton @click="nextPage()">next page</UiButton>
    </div>
    <div v-else-if="loading">
        <p>Loading...</p>
    </div>
</template>
<script setup lang="ts">
const { data, fetchLastSeenProducts, nextPage, loading, itemsNotFetched } = useLastSeen();

const products = computed(() => {
    return Array.from(data.value.values());
});

onNuxtReady(() => {
    watch(itemsNotFetched, () => {
        fetchLastSeenProducts(10);
    }, {
        immediate: true
    })
});


</script>