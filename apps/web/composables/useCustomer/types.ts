import type { Ref } from 'vue';
import type { SessionResult } from '@plentymarkets/shop-api';

export interface UseCustomerState {
  data: SessionResult;
  loading: boolean;
  isAuthorized: boolean;
  isGuest: boolean;
}

export type GetSession = () => Promise<SessionResult>;

export type LoginAsGuest = (email: string) => Promise<void>;
export type Login = (email: string, password: string) => void;
export type SetUser = (data: SessionResult) => void;

export interface UseCustomer {
  data: Readonly<Ref<UseCustomerState['data']>>;
  isAuthorized: Readonly<Ref<UseCustomerState['isAuthorized']>>;
  isGuest: Readonly<Ref<UseCustomerState['isGuest']>>;

  loading: Readonly<Ref<boolean>>;
  setUser: SetUser;
  getSession: GetSession;
  login: Login;
  loginAsGuest: LoginAsGuest;
}

export type UseCustomerReturn = () => UseCustomer;
