import type { CustomerContactEmailParams } from '@plentymarkets/shop-api';
import type { DoCustomerContactMail, UseCustomerContactReturn, UseCustomerContactState } from './types';

/**
 * @description Composable for managing customer contact.
 * @returns UseCustomerContactReturn
 * @example
 * ``` ts
 * const { data, loading, doCustomerContactMail } = useCustomerContact();
 * ```
 */
export const useCustomerContact: UseCustomerContactReturn = () => {
  const state = useState<UseCustomerContactState>('useCustomerContact', () => ({
    data: null,
    loading: false,
  }));

  /**
   * @description Function for sending contact request.
   * @example
   * ``` ts
   * doCustomerContactMail({
   *    name: '',
   *    email: '',
   *    subject: '',
   *    orderId: '',
   *    message: '',
   * });
   * ```
   */
  const doCustomerContactMail: DoCustomerContactMail = async (params: CustomerContactEmailParams) => {
    state.value.loading = true;
    try {
      const { data, error } = await useAsyncData(() => useSdk().plentysystems.doCustomerContactMail(params));
      useHandleError(error.value);
      state.value.data = data?.value?.data ?? state.value.data;

      return !!data.value;
    } catch (error) {
      throw new Error(error as string);
    } finally {
      state.value.loading = false;
    }
  };

  return {
    doCustomerContactMail,
    ...toRefs(state.value),
  };
};
