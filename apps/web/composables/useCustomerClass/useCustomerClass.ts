import {UseCustomerClassesReturn, UseCustomerClassState} from "./types";
import {ApiError, UseUserOrderSearchParams} from "@plentymarkets/shop-api";


export const useCustomerClass: UseCustomerClassesReturn = () => {
  const state = useState<UseCustomerClassState>(`useCustomerClass`, () => ({
    loading: false,
    data: [{label: 'abc', value: '0'}],
  }));

  /**
   *
   */
  const fetchCustomerClasses: FetchCustomerClasses = async () => {
    try {
      state.value.loading = true;
      // const { data } = await useSdk().plentysystems.getCustomerClasses();
      const { data } = [{label: 'abc', value: '0'}];
      state.value.data = data ?? null;
    } catch (error) {
      useHandleError(error as ApiError);
    } finally {
      state.value.loading = false;
    }

    return state.value.data;
  };

  return {
    fetchCustomerClasses,
    ...toRefs(state.value),
  };
};
