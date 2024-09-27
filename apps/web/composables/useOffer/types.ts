import type { Offer, GetOfferError, OfferSearchParams, Order } from '@plentymarkets/shop-api';

export interface UseOfferState {
  data: Offer | string;
  relatedOrder: Order | null;
  loading: boolean;
  error: GetOfferError | null;
}

export type FetchOffer = (params: OfferSearchParams) => Promise<Offer | string>;
export type DeclineOffer = (params: OfferSearchParams) => Promise<string>;
export type AcceptOffer = (params: OfferSearchParams) => Promise<Order | null>;

export interface UseOffer {
  data: Readonly<Ref<UseOfferState['data']>>;
  loading: Readonly<Ref<UseOfferState['loading']>>;
  fetchOffer: FetchOffer;
  declineOffer: DeclineOffer;
  acceptOffer: AcceptOffer;
  error: Readonly<Ref<UseOfferState['error']>>;
}
export type UseOfferReturn = () => UseOffer;
