export interface NotifyMeSubscribeParams {
  email: string;
  variationId: number;
  turnstileToken?: string;
}

export interface UseNotifyMeState {
  loading: boolean;
}

export type Subscribe = (params: NotifyMeSubscribeParams) => Promise<boolean>;

export interface UseNotifyMe {
  loading: Readonly<Ref<boolean>>;
  subscribe: Subscribe;
}

export type UseNotifyMeReturn = () => UseNotifyMe;
