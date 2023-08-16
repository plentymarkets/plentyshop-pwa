import type { Ref } from 'vue';
import type { SessionResult } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';
import type { Maybe, SfCustomer } from '@vue-storefront/unified-data-model';

export interface UseAccountState {
  data: Maybe<SessionResult>;
  loading: boolean;
}

export type FetchAccount = () => Promise<Ref<Maybe<SessionResult>>>;

export type LoginAsGuest = (email: string) => Promise<void>;

export interface UseAccount {
  data: Readonly<Ref<UseAccountState['data']>>;
  loading: Readonly<Ref<boolean>>;
  fetchAccount: FetchAccount;
  loginAsGuest: LoginAsGuest;
}

export type UseAccountReturn = () => UseAccount;
