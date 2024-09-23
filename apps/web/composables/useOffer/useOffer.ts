import { GetOfferError, Offer, OfferSearchParams } from '@plentymarkets/shop-api';
import { FetchOffer, UseOfferReturn } from './types';

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

    const offerData = data.value?.data as Offer;
    const errorData = data.value?.data as GetOfferError;

    state.value.data = offerData?.order ? offerData : ({} as Offer);
    state.value.error = errorData?.error ? errorData : null;

    state.value.loading = false;
    return state.value.data;
  };

  const declineOffer = async (params: OfferSearchParams) => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.doRejectOffer(params));
    useHandleError(error.value);

    const offerData = data.value?.data as string;
    const errorData = data.value?.data as GetOfferError;

    state.value.data = offerData;
    state.value.error = errorData?.error ? errorData : null;

    state.value.loading = false;
    return state.value.data;
  };

  const acceptOffer = async (params: OfferSearchParams) => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.doAcceptOffer(params));
    useHandleError(error.value);

    const offerData = data.value?.data as Offer;
    const errorData = data.value?.data as GetOfferError;

    state.value.data = offerData?.order ? offerData : ({} as Offer);
    state.value.error = errorData?.error ? errorData : null;

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
