import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { CookieGroup } from '~/configuration/cookie.config';

const { useCookie } = vi.hoisted(() => ({
  useCookie: vi.fn().mockReturnValue({}),
}));

const { useRouter } = vi.hoisted(() => ({
  useRouter: vi.fn().mockReturnValue({
    go: vi.fn(),
  }),
}));

mockNuxtImport('useRouter', () => useRouter);
mockNuxtImport('useCookie', () => useCookie);

describe('useReadCookieBar', () => {

  describe('initializeCookies', () => {
    it('should set cookies from initial configuration', () => {
      const { initializeCookies, data } = useReadCookieBar();
      initializeCookies();
      expect(data.value.groups).toBeDefined();
      expect(data.value.groups.length).toBeGreaterThan(0);
    });

    it('should set accepted state for essential cookies', () => {
      const { initializeCookies, data } = useReadCookieBar();
      initializeCookies();
      data.value.groups.forEach((group, index) => {
        if (index === defaults.ESSENTIAL_COOKIES_INDEX) {
          group.cookies.forEach(cookie => {
            expect(cookie.accepted).toBe(true);
            const { consent } = useCookieConsent(cookie.name);
            expect(consent.value).toBe(true);
          });
        }
      });
    });

    it('should set accepted state for opt-out', () => {
      const cookieGroup = useRuntimeConfig().public.cookieGroups.groups[2] as CookieGroup;
      const cookie = cookieGroup.cookies[0];
      const { initializeCookies, data } = useReadCookieBar();
      const { consent } = useCookieConsent(cookie.name);

      cookie.accepted = true;
      initializeCookies();
      expect(consent.value).toBe(false);
      expect(data.value.groups[2].cookies[0].accepted).toBe(true);
    });

    it('should set state read from browser-cookie', () => {
      const { initializeCookies, data } = useReadCookieBar();
      const browserCookies = {
        'CookieBar.functional.label': {
          'CookieBar.functional.cookies.scriptDemo.name': true,
        },
      };
      useCookie.mockReturnValue({ value: browserCookies });
      initializeCookies();
      expect(data.value.groups[2].cookies[0].accepted).toBe(true);
    });

    it('should load third party scripts', () => {
      const { initializeCookies, setAllCookiesState, setConsent } = useReadCookieBar();
      initializeCookies();
      setAllCookiesState(true);

      // TODO
      // expect(fetchScripts).toHaveBeenCalledOnce();
    });
  });

  describe('setConsent', () => {
    beforeEach(() => {
      useCookie.mockImplementation(() => ({
        value: {
          'CookieBar.functional.label': {
            'CookieBar.essentials.cookies.payPal.name': true,
            'CookieBar.functional.cookies.scriptDemo.name': true,
          }
        },
      }));
    });

    it('should reload the page if a consent cookie is revoked', () => {
      const { setConsent, initializeCookies, data } = useReadCookieBar();
      const RouterGoSpy = vi.fn();

      useRouter.mockReturnValue({
        go: RouterGoSpy,
      });

      initializeCookies();
      data.value.groups[2].cookies[0].accepted = false;
      setConsent();

      expect(RouterGoSpy).toHaveBeenCalledTimes(1);
    });

    it('should not reload the page if a consent cookie is accepted', () => {
      const { setConsent, initializeCookies } = useReadCookieBar();
      const RouterGoSpy = vi.fn();

      useRouter.mockReturnValue({
        go: RouterGoSpy,
      });

      initializeCookies();
      setConsent();

      expect(RouterGoSpy).toHaveBeenCalledTimes(0);
    });

    it('should reject all non-essential cookies', () => {
      const { setAllCookiesState, initializeCookies, data } = useReadCookieBar();
      initializeCookies();
      setAllCookiesState(false);
      data.value.groups.forEach((group, index) => {
      const requiredValue = index === defaults.ESSENTIAL_COOKIES_INDEX;
        expect(group.accepted).toBe(requiredValue);
        group.cookies.forEach(cookie => {
          expect(cookie.accepted).toBe(requiredValue)

          const { consent } = useCookieConsent(cookie.name);
          expect(consent.value).toBe(requiredValue);
        });
      });
    });

    it('should accept all cookies', () => {
      const { setAllCookiesState, initializeCookies, data } = useReadCookieBar();
      initializeCookies();
      setAllCookiesState(true);
      data.value.groups.forEach((group) => {
        expect(group.accepted).toBe(true);
        group.cookies.forEach(cookie => {
          expect(cookie.accepted).toBe(true)

          const { consent } = useCookieConsent(cookie.name);
          expect(consent.value).toBe(true);
        });
      });
    });
  });
});