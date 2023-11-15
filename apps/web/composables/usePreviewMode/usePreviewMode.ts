import { SetHiddenState, UsePreviewModeReturn, UsePreviewModeState, TargetCookies } from './types';

export const usePreviewMode: UsePreviewModeReturn = () => {
  const state = useState<UsePreviewModeState>('usePreviewModeState', () => ({
    bannerIsHidden: true,
    foundCookies: TargetCookies.filter((item) => !!useCookie(item).value),
  }));

  function foundlookupCookies() {
    return state.value.foundCookies.length > 0;
  }

  function removeLookupCookie(index: number) {
    useCookie(state.value.foundCookies[index]).value = null;
    state.value.foundCookies.splice(index, 1);
    state.value.bannerIsHidden = true;
  }

  const setHiddenState: SetHiddenState = (value: boolean) => {
    state.value.bannerIsHidden = value;
  };

  return {
    foundlookupCookies,
    removeLookupCookie,
    setHiddenState,
    ...toRefs(state.value),
  };
};
