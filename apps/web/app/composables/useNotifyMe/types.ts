import type {
  NotifyMeSubscribeParams,
  NotifyMeSuccessResponse,
  NotifyMeRouteTokenParams,
} from '@plentymarkets/shop-api';

export interface UseNotifyMeState {
  loading: boolean;
}

export type Subscribe = (params: NotifyMeSubscribeParams) => Promise<NotifyMeSuccessResponse | undefined>;

export type ConfirmNotifyMe = (params: NotifyMeRouteTokenParams) => Promise<NotifyMeSuccessResponse | undefined>;

export type UnsubscribeNotifyMe = (params: NotifyMeRouteTokenParams) => Promise<NotifyMeSuccessResponse | undefined>;

export interface UseNotifyMe {
  loading: Readonly<Ref<boolean>>;
  subscribe: Subscribe;
  confirmNotifyMe: ConfirmNotifyMe;
  unsubscribeNotifyMe: UnsubscribeNotifyMe;
}

export type UseNotifyMeReturn = () => UseNotifyMe;
