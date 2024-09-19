import type { Offer, GetOfferError, OfferSearchParams } from '@plentymarkets/shop-api';

export interface UseOfferState {
  data: Offer;
  loading: boolean;
  error: GetOfferError | null;
}

export type FetchOffer = (params: OfferSearchParams) => Promise<Offer | null>;

export interface UseOffer {
  data: Readonly<Ref<UseOfferState['data']>>;
  loading: Readonly<Ref<UseOfferState['loading']>>;
  fetchOffer: FetchOffer;
  error: Readonly<Ref<UseOfferState['error']>>;
}
export type UseOfferReturn = () => UseOffer;
