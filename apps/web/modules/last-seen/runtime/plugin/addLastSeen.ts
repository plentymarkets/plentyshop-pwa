import { defineNuxtPlugin } from '#app';
import { productGetters } from '@plentymarkets/shop-api';
import { useLastSeen } from '../composables/useLastSeen';

export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    const { on } = usePlentyEvent();

    on('frontend:productLoaded', (event) => {
      const variationId = productGetters.getId(event.product);
      if (variationId) useLastSeen().addToLastSeen(event.product);
    });
  }
  const { addComponent } = useModuleRendering('cart.empty');
  addComponent('LastSeen');
});
