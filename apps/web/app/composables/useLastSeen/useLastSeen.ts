import type { Product } from '@plentymarkets/shop-api';
import { productGetters } from '@plentymarkets/shop-api';

export const useLastSeen = () => {
  const addLastSeen = (product: Product) => {
    if (import.meta.client) {
      try {
        useSdk().plentysystems.doAddLastSeen(productGetters.getVariationId(product));
      } catch {}
    }
  };

  return {
    addLastSeen,
  };
};
