import type { Offer, GetOfferError, OfferSearchParams } from '@plentymarkets/shop-api';

export interface UseOfferState {
  data: Offer | string;
  loading: boolean;
  error: GetOfferError | null;
}

export type FetchOffer = (params: OfferSearchParams) => Promise<Offer | string>;
export type DeclineOffer = (params: OfferSearchParams) => Promise<string | null>;
export type AcceptOffer = (params: OfferSearchParams) => Promise<Offer | null>;

export interface UseOffer {
  data: Readonly<Ref<UseOfferState['data']>>;
  loading: Readonly<Ref<UseOfferState['loading']>>;
  fetchOffer: FetchOffer;
  declineOffer: DeclineOffer;
  acceptOffer: AcceptOffer;
  error: Readonly<Ref<UseOfferState['error']>>;
}
export type UseOfferReturn = () => UseOffer;
