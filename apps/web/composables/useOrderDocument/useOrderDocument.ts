import { OrderDocument } from '@plentymarkets/shop-api';
import { toRefs } from '@vueuse/shared';
import { useSdk } from '~/sdk';
import type { UseOrderDocumentState, UseOrderDocumentMethodsReturn } from './types';
import { GetDocument } from './types';

/**
 * @description Composable for getting the legal information.
 * @returns {@link UseOrderDocumentMethodsReturn}
 * @example
 * const { data, loading } = UseOrderDocument();
 */
export const useOrderDocument: UseOrderDocumentMethodsReturn = () => {
  const state = useState<UseOrderDocumentState>('useOrderDocument', () => ({
    data: [],
    loading: false,
  }));

  const getDocument: GetDocument = async (document: OrderDocument, accessKey: string) => {
    state.value.loading = true;
    try {
      const { data } = await useSdk().plentysystems.getOrderDocument({ document, accessKey });

      state.value.data = data ?? state.value.data;
      return state.value.data;
    } catch (error) {
      throw new Error(error as string);
    } finally {
      state.value.loading = false;
    }
  };

  return {
    getDocument,
    ...toRefs(state.value),
  };
};
