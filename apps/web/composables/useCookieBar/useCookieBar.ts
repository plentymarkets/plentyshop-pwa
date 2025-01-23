import type { CookieRef } from 'nuxt/app';
import type { Cookie, CookieGroup, CookieGroupFromNuxtConfig } from '~/configuration/cookie.config';
import type { UseCookieReturn } from './types';

const checkIfScriptIsExternal = (scriptName: string): boolean => {
  return scriptName.startsWith('http');
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function convertToSaveableJson(jsonList: any): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return jsonList.map((group: any) => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [group.name]: group.cookies.map((cookie: any) => ({
      [cookie.name]: cookie.accepted,
    })),
  }));
}

/**
 * @description Composable for managing cookie bar.
 * @returns UseCookieReturn
 * @example
 * ``` ts
 * const {
 * cookieJson, bannerIsHidden, setHiddenState, convertAndSaveCookies, loadThirdPartyScripts, defaultCheckboxIndex
 * } = useCookieBar(consentCookie, initCheckboxIndex, initialCookieJsonFromConfig);
 * ```
 */
export const useCookieBar = (
  consentCookie: CookieRef<CookieGroup[]>,
  initCheckboxIndex: number,
  initialCookieJsonFromConfig: CookieGroupFromNuxtConfig,
): UseCookieReturn => {
  const bannerIsHidden = ref(false);
  const defaultCheckboxIndex = initCheckboxIndex;
  const cookieJsonFromConfig = initialCookieJsonFromConfig;
  const cookieJson: Ref<CookieGroup[]> = ref(
    initialCookieJsonFromConfig.groups.map((group: CookieGroup) => ({
      name: group.name,
      accepted: false,
      showMore: false,
      description: group.description,
      cookies: group.cookies.map((cookie: Cookie) => ({
        ...cookie,
        accepted: false,
        name: cookie.name,
      })),
    })),
  );
  const existingCookieInMemory = consentCookie;

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

  /**
   * @description Function for loading third party scripts.
   * @return void
   * @example
   * ``` ts
   * loadThirdPartyScripts();
   * ```
   */
  function loadThirdPartyScripts(): void {
    if (!import.meta.server) {
      cookieJson.value.forEach((cookieGroup, groupIndex) => {
        cookieGroup.cookies.forEach((cookie, cookieIndex) => {
          if (cookie.accepted) {
            const scripts = cookieJsonFromConfig.groups[groupIndex].cookies[cookieIndex].script;

            if (scripts && scripts.length > 0) {
              scripts.forEach((script: string) => {
                try {
                  if (checkIfScriptIsExternal(script)) {
                    fetch(script, {
                      method: 'GET',
                      mode: 'no-cors',
                      credentials: 'same-origin',
                    })
                      .then((response) => response.text())
                      .then((text) => (0, eval)(text))
                      .catch(() => {
                        return;
                      });
                  } else {
                    (0, eval)(script);
                  }
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (error: any) {
                  // @TODO error handling
                  return new Error(error);
                }
              });
            }
          }
        });
      });
    }
  }

  /**
   * @description Function for saving the cookies.
   * @param setAllCookies
   * @param latestStatus
   * @return string
   * @example
   * ``` ts
   * convertAndSaveCookies(true, true);
   * ```
   */
  function convertAndSaveCookies(setAllCookies: boolean, latestStatus: boolean): string {
    if (setAllCookies) {
      // accept all or reject all case (update cookieJson and checkboxes from ui)
      cookieJson.value.forEach((group, index) => {
        if (index !== defaultCheckboxIndex) {
          group.accepted = latestStatus;
          group.cookies.forEach((cookie) => {
            cookie.accepted = latestStatus;
          });
        }
      });
    }
    bannerIsHidden.value = true;
    loadThirdPartyScripts();
    return convertToSaveableJson(cookieJson.value);
  }
  // initiate cookieJson based from previouly saved cookies
  if (existingCookieInMemory.value) {
    existingCookieInMemory.value.forEach((group: CookieGroup, index: number) => {
      const cookieGroupFromMemory = Object.values(group)[0];
      let atLeastOneIsTrue = false;

      cookieGroupFromMemory.forEach((cookie: CookieGroup, index2: number) => {
        if (Object.values(cookie)[0]) {
          cookieJson.value[index].cookies[index2].accepted = true;
        }
        atLeastOneIsTrue = Object.values(cookie)[0] ? true : atLeastOneIsTrue;
      });

      cookieJson.value[index].accepted = atLeastOneIsTrue;
      bannerIsHidden.value = atLeastOneIsTrue || bannerIsHidden.value;
    });
  }
  // Mark default checkbox group as true
  cookieJson.value[defaultCheckboxIndex].accepted = true;
  cookieJson.value[defaultCheckboxIndex].cookies = cookieJson.value[0].cookies.map((cookie) => ({
    ...cookie,
    accepted: true,
  }));

  onMounted(() => {
    loadThirdPartyScripts();
  });

  return {
    cookieJson: cookieJson.value,
    bannerIsHidden: computed(() => bannerIsHidden.value),
    setHiddenState,
    convertAndSaveCookies,
    loadThirdPartyScripts,
    defaultCheckboxIndex,
  };
};
