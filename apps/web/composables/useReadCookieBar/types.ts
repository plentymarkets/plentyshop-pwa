import type { CookieGroupFromNuxtConfig } from '~/cookie.config';

export interface UseReadCookieBarState {
  data: CookieGroupFromNuxtConfig;
  loading: boolean;
  visible: boolean;
}

export type ChangeVisibilityState = () => void;
export type SetConsent = () => void;
export type InitializeCookies = () => void;
export type SetAllCookiesState = (accepted: boolean) => void;

export interface UseReadCookieBar {
  data: Readonly<Ref<UseReadCookieBarState['data']>>;
  loading: Readonly<Ref<boolean>>;
  visible: Readonly<Ref<boolean>>;
  changeVisibilityState: ChangeVisibilityState;
  setConsent: SetConsent;
  initializeCookies: InitializeCookies;
  setAllCookiesState: SetAllCookiesState;
}

export type UseReadCookieBarReturn = () => UseReadCookieBar;
