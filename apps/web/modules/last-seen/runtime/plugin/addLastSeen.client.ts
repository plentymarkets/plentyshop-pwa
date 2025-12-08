import { defineNuxtPlugin } from '#app';
import { productGetters } from '@plentymarkets/shop-api';

export default defineNuxtPlugin(() => {
    const { on } = usePlentyEvent();

    on('frontend:productLoaded', (event) => {
        const variationId = productGetters.getId(event.product);
        if (variationId) useLastSeen().addToLastSeen(Number(variationId));
    });
});