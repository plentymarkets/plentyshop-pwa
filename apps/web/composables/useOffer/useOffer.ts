import { GetOfferError, Offer, OfferSearchParams } from '@plentymarkets/shop-api';
import { AcceptOffer, DeclineOffer, FetchOffer, UseOfferReturn } from './types';

export const useOffer: UseOfferReturn = () => {
  const state = useState<UseOfferState>('useOffer-', () => ({
    data: {} as Offer | string,
    loading: false,
    error: null,
  }));

  const fetchOffer: FetchOffer = async (params: OfferSearchParams) => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.getOffer(params));
    useHandleError(error.value);

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
    state.value.loading = true;
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.doRejectOffer(params));
    useHandleError(error.value);

    const offerData = data.value?.data as string;
    state.value.data = offerData;

    state.value.loading = false;
    return state.value.data;
  };

  const acceptOffer: AcceptOffer = async (params: OfferSearchParams) => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.doAcceptOffer(params));
    useHandleError(error.value);

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
