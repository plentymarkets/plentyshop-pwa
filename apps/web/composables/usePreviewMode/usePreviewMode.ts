import { CookieRef } from 'nuxt/app';
import { Cookie } from 'cookie.config';
import { UseCookieReturn } from './types';

export const usePreviewMode = (cookie: CookieRef<Cookie[]>): UseCookieReturn => {
  const bannerIsHidden = ref(true);

  const existingCookieInMemory = cookie;

  /**
   * @description Function for setting the hidden state for the banner.
   * @param state
   * @return void
   * @example
   * ``` ts
   * setHiddenState(true);
   * ```
   */
  function setHiddenState(state: boolean): void {
    bannerIsHidden.value = state;
  }

  return {
    bannerIsHidden: computed(() => bannerIsHidden.value),
    setHiddenState,
  };
};
