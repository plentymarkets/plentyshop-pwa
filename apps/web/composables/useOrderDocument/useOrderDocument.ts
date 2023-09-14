import { OrderDocument } from '@plentymarkets/shop-api';
import { toRefs } from '@vueuse/shared';
import { useSdk } from '~/sdk';
import type { UseOrderDocumentState, UseOrderDocumentMethodsReturn } from './types';
import { DownloadFile, GetDocument } from './types';

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

  const downloadFile: DownloadFile = (bufferArray: number[], name: string, type: string) => {
    const base64PDF = window.btoa(String.fromCharCode.apply(null, bufferArray));

    const link = document.createElement('a');
    link.href = `data:${type};base64,${base64PDF}`;
    link.download = name;
    link.click();

    setTimeout(() => {
      link.remove();
      window.URL.revokeObjectURL(link.href);
    }, 200);
  };

  return {
    getDocument,
    downloadFile,
    ...toRefs(state.value),
  };
};
