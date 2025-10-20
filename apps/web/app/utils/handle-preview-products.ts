import { facetMock } from './facets/fakeFacetCall';
import { fakeProduct } from './facets/fakeProduct';

import type { UseProductsState } from '~/composables/useProducts/types';

export const handlePreviewProducts = (state: Ref<UseProductsState>) => {
  const { $isPreview } = useNuxtApp();

  if ($isPreview && state.value.data.products.length === 0) {
    state.value.data = facetMock.data;
    state.value.data.products = Array.from({ length: 8 }, (_, ind) => ({
      ...fakeProduct,
      texts: {
        ...(fakeProduct.texts ?? {}),
        name1: 'Example Product ' + (ind + 1),
      },
    }));
  }
};
