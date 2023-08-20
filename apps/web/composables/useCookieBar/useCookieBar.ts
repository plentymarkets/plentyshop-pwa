import { Cookie, CookieGroup, UseCookieReturn } from './types';

function checkIfScriptIsExternal(scriptName: string): boolean {
  return scriptName.startsWith('http');
}

export const useCookieBar = (
  consentCookie: any,
  defaultCookieKey: string,
  initCheckboxIndex: number,
  initialCookieJsonFromConfig: any,
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

  function setHiddenState(state: boolean): void {
    bannerIsHidden.value = state;
  }

  function loadThirdPartyScripts(): void {
    if (!process.server) {
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
                      .then((text) => (0, eval)(text));
                  } else {
                    (0, eval)(script);
                  }
                } catch {
                  // @TODO error handling
                }
              });
            }
          }
        });
      });
    }
  }
  function getMinimumLifeSpan(): number {
    // expected minimum lifetime span to be in days
    const convertToDays = (daysInString: string): number => {
      return Number.parseInt(daysInString.split(' ')[0]);
    };

    let minimum = 100_000;

    cookieJsonFromConfig.groups.forEach((group: CookieGroup) => {
      group.cookies.forEach((cookie) => {
        if (minimum > convertToDays(cookie.Lifespan)) {
          minimum = convertToDays(cookie.Lifespan);
        }
      });
    });
    return minimum;
  }
  function saveCookies(key: string, cookieValue: string, useCookie: any): void {
    const minimumOfAllMinimums = 60 * 60 * 24 * getMinimumLifeSpan();

    // TODO set minimum maxAge
    /* const cookie = useCookie(key, {
      path: '/',
      maxAge: minimumOfAllMinimums
     }); */
    useCookie.value = cookieValue;
  }
  function convertToSaveableJson(jsonList: any): any {
    let toSave = [];

    toSave = jsonList.map((group: any) => ({
      [group.name]: group.cookies.map((cookie: any) => ({
        [cookie.name]: cookie.accepted,
      })),
    }));
    return toSave;
  }
  function convertAndSaveCookies(setAllCookies: boolean, newStatus: boolean): void {
    if (setAllCookies) {
      // accept all or reject all case (update cookieJson and checkboxes from ui)
      cookieJson.value.forEach((group, index) => {
        if (index !== defaultCheckboxIndex) {
          group.accepted = newStatus;
          group.cookies.forEach((cookie) => {
            cookie.accepted = newStatus;
          });
        }
      });
    }
    const toSave = convertToSaveableJson(cookieJson.value);

    saveCookies('consent-cookie', toSave, consentCookie);
    bannerIsHidden.value = true;
    loadThirdPartyScripts();
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
      bannerIsHidden.value = atLeastOneIsTrue ? atLeastOneIsTrue : bannerIsHidden.value;
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
