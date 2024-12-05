import {
  ApiError,
  Data,
  GetOfferError,
  GetOfferReject,
  Offer,
  OfferSearchParams,
  Order,
} from '@plentymarkets/shop-api';
import { AcceptOffer, DeclineOffer, FetchOffer, UseOfferReturn } from './types';

export const useOffer: UseOfferReturn = () => {
  const state = useState<UseOfferState>('useOffer-', () => ({
    data: {} as Offer,
    relatedOrder: null,
    loading: false,
    error: null,
  }));

  const handleApiCall = async (apiCall: () => Promise<Data<Offer | GetOfferError | GetOfferReject | Order>>) => {
    state.value.loading = true;
    let data_: Ref<Data<Order | GetOfferError | Offer | GetOfferReject> | null> = ref(null);

    try {
      const data = await apiCall();
      data_ = ref(data);
    } catch (ApiError) {
      useHandleError(ApiError as ApiError);
    }

    return { data: data_ };
  };

  const fetchOffer: FetchOffer = async (params: OfferSearchParams) => {
    const { data } = await handleApiCall(() => useSdk().plentysystems.getOffer(params));

    if (typeof data.value?.data === 'object' && 'error' in data.value.data) {
      const errorData = data.value?.data as GetOfferError;
      state.value.error = errorData?.error ? errorData : null;
    }
    if (typeof data.value?.data === 'object' && 'order' in data.value.data) {
      const offerData = data.value?.data as Offer;
      state.value.data = offerData?.order ? offerData : ({} as Offer);
      state.value.error = null;
    }

    state.value.loading = false;
    return state.value.data;
  };

  const declineOffer: DeclineOffer = async (params: OfferSearchParams) => {
    await handleApiCall(() => useSdk().plentysystems.doRejectOffer(params));

    state.value.loading = false;
  };

  const acceptOffer: AcceptOffer = async (params: OfferSearchParams) => {
    const { data } = await handleApiCall(() => useSdk().plentysystems.doAcceptOffer(params));

    const orderData = data.value?.data as Order;
    state.value.relatedOrder = orderData?.order ? orderData : null;

    state.value.loading = false;
    return state.value.relatedOrder;
  };

  return {
    fetchOffer,
    declineOffer,
    acceptOffer,
    ...toRefs(state.value),
  };
};
