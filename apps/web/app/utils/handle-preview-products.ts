import { facetMock } from './facets/fakeFacetCall';
import { fakeProductEN } from './facets/fakeProductEN';

import type { UseProductsState } from '~/composables/useProducts/types';

export const handlePreviewProducts = (state: Ref<UseProductsState>) => {
  const { $isPreview } = useNuxtApp();

  if (state.value.data.category.type === 'item' && $isPreview && state.value.data.products.length === 0) {
    state.value.data = facetMock.data;
    state.value.data.products = Array.from({ length: 8 }, (_, ind) => ({
      ...fakeProductEN,
      texts: {
        ...(fakeProductEN.texts ?? {}),
        name1: 'Example Product ' + (ind + 1),
      },
    }));
  }
};
