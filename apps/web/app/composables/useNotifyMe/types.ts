import type { NotifyMeSubscribeParams, NotifyMeSubscribeResponse } from '@plentymarkets/shop-api';

export interface UseNotifyMeState {
  loading: boolean;
}

export type Subscribe = (params: NotifyMeSubscribeParams) => Promise<NotifyMeSubscribeResponse | undefined>;

export interface UseNotifyMe {
  loading: Readonly<Ref<boolean>>;
  subscribe: Subscribe;
}

export type UseNotifyMeReturn = () => UseNotifyMe;
