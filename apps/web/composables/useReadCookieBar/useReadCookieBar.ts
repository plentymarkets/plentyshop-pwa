import { toRefs } from '@vueuse/shared';
import type { UseReadCookieBarState, UseReadCookieBarReturn } from './types';
import { CookieGroup } from 'cookie.config';

const defaultCheckboxIndex = 0;

/**
 * @description Composable for managing cookie bar.
 * @returns UseReadCookieBarReturn
 * @example
 * ``` ts
 * const { data, loading } = useReadCookieBar();
 * ```
 */
export const useReadCookieBar: UseReadCookieBarReturn = () => {
  const state = useState<UseReadCookieBarState>('useReadCookieBar', () => ({
    data: [] as CookieGroup[],
    visible: false,
    loading: false,
  }));

  const changeVisibilityState = (): void => {
    state.value.visible = !state.value.visible;
  };

  const setCookies = (): void => {
    // TODO: set initial cookies to consider browser cookies
    const runtimeConfig = useRuntimeConfig();

    const initialCookies = runtimeConfig.public.cookieGroups;
    const res = { ...initialCookies };

    const browserCookies = useCookie('consent-cookie');
    console.log('initialCookies: ', initialCookies);

    // res.groups[0].cookies[0].accepted = true;

    // res.groups.forEach((group) => {
    //   group.cookies.forEach((cookie) => {
    //
    //     const temp = { ...cookie }
    //     temp.accepted = true
    //     cookie = {...cookie, ...temp}
    //
    //     // cookie.accepted = browserCookies?.[group.name]?.[cookie.name] || false;
    //   });
    // });

    // browserCookies.forEach((group, index) => {
    //
    // })

    console.log('initialCookies:', res);

    state.value.data = runtimeConfig.public.cookieGroups;
  };

  const setConsent = (): void => {
    const { getMinimumLifeSpan } = cookieBarHelper();

    const jsonCookie = {};

    // TODO: cleanup
    state.value.data.groups.forEach((group) => {
      const children = group.cookies;

      const childrenObject = {};

      children.forEach((child) => {
        childrenObject[child.name] = child.accepted;
      });

      jsonCookie[group.name] = childrenObject;
    });

    const consentCookie = useCookie('consent-cookie', {
      path: '/',
      maxAge: getMinimumLifeSpan(state.value.data.groups),
    });

    consentCookie.value = jsonCookie;

    changeVisibilityState();
  };

  const setAllCookiesState = (accepted: boolean): void => {
    state.value.data.groups.forEach((group, index) => {
      if (index !== defaultCheckboxIndex) {
        group.accepted = accepted;
        group.cookies.forEach((cookie) => {
          cookie.accepted = accepted;
        });
      }
    });

    setConsent();
  };

  return {
    ...toRefs(state.value),
    changeVisibilityState,
    setConsent,
    setCookies,
    setAllCookiesState,
  };
};
