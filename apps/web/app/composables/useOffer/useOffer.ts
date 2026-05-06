import type {
  ApiError,
  Data,
  GetOfferError,
  GetOfferReject,
  Offer,
  OfferSearchParams,
  Order,
} from '@plentymarkets/shop-api';
import type { AcceptOffer, DeclineOffer, FetchOffer, UseOfferReturn } from './types';

export const useOffer: UseOfferReturn = () => {
  const { send } = useNotification();

  const state = useState<UseOfferState>('useOffer-', () => ({
    data: {} as Offer,
    relatedOrder: null,
    loading: false,
    error: null,
    hasError: false,
  }));

  const checkForErrorData = async (data: Ref<Data<Order | GetOfferError | Offer | GetOfferReject> | null>) => {
    const innerData = data.value?.data;
    if (typeof innerData === 'object' && innerData && 'error' in innerData) {
      const errorData = innerData as GetOfferError;
      state.value.error = errorData?.error ? errorData : null;
      state.value.hasError = true;
      if (import.meta.client) {
        send({ type: 'warning', message: errorData.error.message });
      }
    } else {
      state.value.error = null;
      state.value.hasError = false;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleApiCall = async (
    apiCall: () => Promise<Data<Offer | GetOfferError | GetOfferReject | Order>>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> => {
    state.value.loading = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data_: Ref<any> = ref(null);

    try {
      data_.value = await apiCall();
      checkForErrorData(data_);
    } catch (error) {
      state.value.hasError = true;
      useHandleError(error as ApiError);
    } finally {
      state.value.loading = false;
    }

    return { data: data_ };
  };

  const fetchOffer: FetchOffer = async (params: OfferSearchParams) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await handleApiCall(() => useSdk().plentysystems.getOffer(params) as any) as any;

    const offerInnerData = data.value?.data;
    if (typeof offerInnerData === 'object' && offerInnerData && 'order' in offerInnerData) {
      const offerData = offerInnerData as Offer;
      state.value.data = offerData?.order ? offerData : ({} as Offer);
      state.value.error = null;
      state.value.hasError = false;
    }

    state.value.loading = false;
    return state.value.data;
  };

  const declineOffer: DeclineOffer = async (params: OfferSearchParams) => {
    await handleApiCall(() => useSdk().plentysystems.doRejectOffer(params));

    state.value.loading = false;
  };

  const acceptOffer: AcceptOffer = async (params: OfferSearchParams) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await handleApiCall(() => useSdk().plentysystems.doAcceptOffer(params) as any) as any;

    const orderData = data.value?.data as Order;
    state.value.relatedOrder = orderData?.order ? orderData : null;
    state.value.hasError = false;

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
