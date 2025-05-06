import type { CustomerContactEmailParams, ApiError } from '@plentymarkets/shop-api';
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
      await useSdk().plentysystems.doCustomerContactMail(params);
      return true;
    } catch (error) {
      useHandleError(error as ApiError);
      return false;
    } finally {
      state.value.loading = false;
    }
  };

  return {
    doCustomerContactMail,
    ...toRefs(state.value),
  };
};
