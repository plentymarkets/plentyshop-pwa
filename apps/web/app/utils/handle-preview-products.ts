import { fakeFacetCallEN } from './facets/fakeFacetCallEN';
import { fakeFacetCallDE } from './facets/fakeFacetCallDE';
import { fakeProductEN } from './facets/fakeProductEN';
import { fakeProductDE } from './facets/fakeProductDE';

import type { UseProductsState } from '~/composables/useProducts/types';

export const handlePreviewProducts = (state: Ref<UseProductsState>, lang: string) => {
  const { $isPreview } = useNuxtApp();

  if (state.value.data.category.type === 'item' && $isPreview && state.value.data.products.length === 0) {
    const fakeFacetCall = lang === 'de' ? fakeFacetCallDE.data : fakeFacetCallEN.data;
    state.value.data = { ...state.value.data, facets: fakeFacetCall.facets };

    const fakeProduct = lang === 'de' ? fakeProductDE : fakeProductEN;
    const exampleProductName = lang === 'de' ? 'Beispielprodukt ' : 'Example Product ';

    state.value.data.products = Array.from({ length: 8 }, (_, ind) => ({
      ...fakeProduct,
      texts: {
        ...(fakeProduct.texts ?? {}),
        name1: exampleProductName + (ind + 1),
      },
    }));

    sendFakeDataNotification();
  }
};
