export const TargetCookies = ['consent-cookie', 'pwa'];

export interface UsePreviewModeState {
  foundCookies: string[];
  bannerIsHidden: boolean;
}

export type RemoveLookupCookie = (index: number) => void;
export type FoundlookupCookies = () => boolean;
export type SetHiddenState = (state: boolean) => void;

export interface UsePreviewModeMethods {
  foundCookies: Readonly<Ref<UsePreviewModeState['foundCookies']>>;
  bannerIsHidden: Readonly<Ref<UsePreviewModeState['bannerIsHidden']>>;
  foundlookupCookies: FoundlookupCookies;
  removeLookupCookie: RemoveLookupCookie;
  setHiddenState: SetHiddenState;
}

export type UsePreviewModeReturn = () => UsePreviewModeMethods;
