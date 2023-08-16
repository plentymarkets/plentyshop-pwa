import type { Ref } from 'vue';
import type { SessionResult } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';

export interface UseAccountState {
  data: SessionResult;
  loading: boolean;
}

export type FetchAccount = () => Promise<SessionResult>;

export type LoginAsGuest = (email: string) => Promise<void>;

export interface UseAccount {
  data: Readonly<Ref<UseAccountState['data']>>;
  loading: Readonly<Ref<boolean>>;
  fetchAccount: FetchAccount;
  loginAsGuest: LoginAsGuest;
}

export type UseAccountReturn = () => UseAccount;
