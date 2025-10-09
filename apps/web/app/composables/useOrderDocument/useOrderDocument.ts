import type { OrderDocument } from '@plentymarkets/shop-api';
import type { UseOrderDocumentState, UseOrderDocumentMethodsReturn, DownloadFile, GetDocument } from './types';

/**
 * @description Composable for managing the order documents.
 * @returns UseOrderDocumentMethodsReturn
 * @example
 * ``` ts
 * const { data, loading, getDocument, downloadFile } = UseOrderDocument();
 * ```
 */
export const useOrderDocument: UseOrderDocumentMethodsReturn = () => {
  const state = useState<UseOrderDocumentState>('useOrderDocument', () => ({
    data: [],
    loading: false,
  }));

  /**
   * @description Function for getting the order document array buffer.
   * @param document { OrderDocument }
   * @param accessKey
   * @return GetDocument
   *
   * @example
   * ``` ts
   * getDocument(document, accessKey)
   * ```
   */
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

  /**
   * @description Function for downloading an array buffer file.
   * @param bufferArray
   * @param name
   * @param type
   * @return DownloadFile
   *
   * @example
   * ``` ts
   * downloadFile(bufferArray, 'test.pdf', 'application/pdf');
   * ```
   */
  const downloadFile: DownloadFile = (bufferArray: number[], name: string, type: string) => {
    state.value.loading = true;
    const base64 = window.btoa(String.fromCharCode.apply(null, bufferArray));

    const link = document.createElement('a');
    link.href = `data:${type};base64,${base64}`;
    link.download = name;
    link.click();

    setTimeout(() => {
      link.remove();
      window.URL.revokeObjectURL(link.href);
    }, 200);
    state.value.loading = false;
  };

  return {
    getDocument,
    downloadFile,
    ...toRefs(state.value),
  };
};
