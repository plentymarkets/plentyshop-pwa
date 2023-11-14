import { UseCookieReturn } from './types';

export const usePreviewMode = (cookieKey: string): UseCookieReturn => {
  const bannerIsHidden = ref(true);

  console.log(cookieKey);

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
