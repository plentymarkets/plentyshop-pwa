<template>
    <div v-if="products.length > 0" class="w-full">
        <h3 class="font-bold mb-3">Last seen products</h3>
        <SfScrollable buttons-placement="floating" class="pb-4 scrollbar-hidden"
            data-testid="product-slider">
            <UiProductCard v-for="product in products" :key="productGetters.getId(product)" :product="product"
                is-from-slider class="max-w-48" />
        </SfScrollable>
        <div class="mt-4 typography-text-xs flex gap-1">
            <span>{{ t('asterisk') }}</span>
            <span v-if="showNetPrices">{{ t('itemExclVAT') }}</span>
            <span v-else>{{ t('itemInclVAT') }}</span>
            <i18n-t keypath="excludedShipping" scope="global">
                <template #shipping>
                    <SfLink :href="localePath(paths.shipping)" target="_blank"
                        class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded">
                        {{ t('delivery') }}
                    </SfLink>
                </template>
            </i18n-t>
        </div>

        <UiButton v-if="totalPages > 1" @click="nextPage()">load more</UiButton>
    </div>
    <div v-else-if="loading">
        <p>Loading...</p>
    </div>
</template>
<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import { SfScrollable, SfLink } from '@storefront-ui/vue';
import { paths } from '~/utils/paths';
import { useLastSeen } from '../../composables/useLastSeen';
const { data, fetchLastSeenProducts, nextPage, loading, itemsNotFetched, totalPages, page } = useLastSeen();


const { showNetPrices } = useCart();
const localePath = useLocalePath();

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