import type { Ref } from 'vue';
import { CookieGroup } from 'cookie.config';

export interface UseReadCookieBarState {
  data: CookieGroup[];
  loading: boolean;
  visible: boolean;
}

// export type GetLegalInformation = (params: LegalTextsParams) => Promise<LegalInformationResponse>;

export interface UseReadCookieBar {
  data: Readonly<Ref<UseReadCookieBarState['data']>>;
  loading: Readonly<Ref<boolean>>;
  visible: Readonly<Ref<boolean>>;
  changeVisibilityState: Readonly<void>;
}

export type UseReadCookieBarReturn = () => UseReadCookieBar;
