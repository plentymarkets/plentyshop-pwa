import { fakeFacetCallEN } from './facets/fakeFacetCallEN';
import { fakeFacetCallDE } from './facets/fakeFacetCallDE';
import { fakeProductEN } from './facets/fakeProductEN';
import { fakeProductDE } from './facets/fakeProductDE';

import type { UseProductsState } from '~/composables/useProducts/types';

export const handlePreviewProducts = (state: Ref<UseProductsState>, lang: string) => {
  const { $isPreview } = useNuxtApp();

  if (state.value.data.category.type === 'item' && $isPreview && state.value.data.products.length === 0) {
    state.value.data = lang === 'de' ? fakeFacetCallDE.data : fakeFacetCallEN.data;
    const fakeProduct = lang === 'de' ? fakeProductDE : fakeProductEN;
    const exampleProductName = lang === 'de' ? 'Beispielprodukt ' : 'Example Product ';
    const defaultAll = [
      {
        names: {
          name: '',
          lang: 'de',
          imageId: 23,
          alternate: '',
        },
        url: '/_nuxt-plenty/images/productPlaceholder.png',
        urlPreview: '/_nuxt-plenty/images/productPlaceholder.png',
        urlSecondPreview: '',
        urlMiddle: '/_nuxt-plenty/images/productPlaceholder.png',
        position: 0,
        path: 'S3:109:109-Barhocker-White-SanFrancisco.jpg',
        cleanImageName: '109-Barhocker-White-SanFrancisco.jpg',
      },
    ];
    state.value.data.products = Array.from({ length: 8 }, (_, ind) => ({
      ...fakeProduct,
      texts: {
        ...(fakeProduct.texts ?? {}),
        name1: exampleProductName + (ind + 1),
      },
    }));
  }
};
