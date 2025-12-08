import { defineNuxtPlugin } from '#app';
import { productGetters } from '@plentymarkets/shop-api';

export default defineNuxtPlugin(() => {
    if (import.meta.client) {
        const { on } = usePlentyEvent();

        on('frontend:productLoaded', (event) => {
            const variationId = productGetters.getId(event.product);
            if (variationId) useLastSeen().addToLastSeen(Number(variationId));
        });
    }
    const { addComponent } = useModuleRendering('cart.empty');
    addComponent('LastSeen');
});