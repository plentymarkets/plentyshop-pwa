import { GetOfferError, Offer, OfferSearchParams } from '@plentymarkets/shop-api';
import { AcceptOffer, DeclineOffer, FetchOffer, UseOfferReturn } from './types';

export const useOffer: UseOfferReturn = () => {
  const state = useState<UseOfferState>('useOffer-', () => ({
    data: {} as Offer | string,
    loading: false,
    error: null,
  }));

  const handleApiCall = async (apiCall: () => Promise<any>) => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(apiCall);
    useHandleError(error.value);

    return { data: data, error: error };
  };

  const fetchOffer: FetchOffer = async (params: OfferSearchParams) => {
    const { data } = await handleApiCall(() => useSdk().plentysystems.getOffer(params));

    if (data.value?.data && typeof data.value === 'object' && 'error' in data.value.data) {
      const errorData = data.value?.data as GetOfferError;
      state.value.error = errorData?.error ? errorData : null;
    }
    if (data.value?.data && typeof data.value === 'object' && 'order' in data.value.data) {
      const offerData = data.value?.data as Offer;
      state.value.data = offerData?.order ? offerData : ({} as Offer);
    }

    state.value.loading = false;
    return state.value.data;
  };

  const declineOffer: DeclineOffer = async (params: OfferSearchParams) => {
    const { data } = await handleApiCall(() => useSdk().plentysystems.doRejectOffer(params));

    state.value.data = data.value?.data ? (data.value.data as string) : '';

    state.value.loading = false;
    return state.value.data;
  };

  const acceptOffer: AcceptOffer = async (params: OfferSearchParams) => {
    const { data } = await handleApiCall(() => useSdk().plentysystems.doAcceptOffer(params));

    const offerData = data.value?.data as Offer;
    state.value.data = offerData?.order ? offerData : ({} as Offer);

    state.value.loading = false;
    return state.value.data;
  };

  return {
    fetchOffer,
    declineOffer,
    acceptOffer,
    ...toRefs(state.value),
  };
};
