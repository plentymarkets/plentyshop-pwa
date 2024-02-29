import type { CookieGroup } from '~/cookie.config';

export interface UseCookieReturn {
  cookieJson: CookieGroup[];
  bannerIsHidden: Ref<boolean>;
  setHiddenState: (state: boolean) => void;
  convertAndSaveCookies: (setAllCookies: boolean, latestStatus: boolean) => void;
  defaultCheckboxIndex: number;
  loadThirdPartyScripts: () => void;
}
