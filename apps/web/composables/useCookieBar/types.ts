import { CookieGroup } from 'cookie.config';

export interface UseCookieReturn {
  cookieJson: CookieGroup[];
  bannerIsHidden: Ref<boolean>;
  setHiddenState: (state: boolean) => void;
  convertAndSaveCookies: (setAllCookies: boolean, newStatus: boolean) => void;
  defaultCheckboxIndex: number;
  loadThirdPartyScripts: () => void;
}
