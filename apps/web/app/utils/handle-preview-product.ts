import { fakeProduct } from './facets/fakeProduct';
import { productGetters } from '@plentymarkets/shop-api';

import type { UseProductState } from '~/composables/useProduct/types';

export const handlePreviewProduct = (state: Ref<UseProductState>) => {
  const { $isPreview } = useNuxtApp();
  // iterate over each prop and if field is null or missing should take value from mock
  // should work even if item structure changes
  if ($isPreview) {
    // state.value.data = fakeProduct;
    // productGetters.getDescription(state.value.data) === ''
    // productGetters.technicalDescription(state.value.data) === ''
  }
};
