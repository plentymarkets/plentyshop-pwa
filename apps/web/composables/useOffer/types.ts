import type { Offer, GetOfferError, OfferSearchParams, Order } from '@plentymarkets/shop-api';

export interface UseOfferState {
  data: Offer;
  relatedOrder: Order | null;
  loading: boolean;
  error: GetOfferError | null;
  hasError: boolean;
}

export type FetchOffer = (params: OfferSearchParams) => Promise<Offer | string>;
export type DeclineOffer = (params: OfferSearchParams) => Promise<void>;
export type AcceptOffer = (params: OfferSearchParams) => Promise<Order | null>;

export interface UseOffer {
  data: Readonly<Ref<UseOfferState['data']>>;
  relatedOrder: Readonly<Ref<UseOfferState['relatedOrder']>>;
  loading: Readonly<Ref<UseOfferState['loading']>>;
  fetchOffer: FetchOffer;
  declineOffer: DeclineOffer;
  acceptOffer: AcceptOffer;
  error: Readonly<Ref<UseOfferState['error']>>;
  hasError: Readonly<Ref<UseOfferState['hasError']>>;
}
export type UseOfferReturn = () => UseOffer;
