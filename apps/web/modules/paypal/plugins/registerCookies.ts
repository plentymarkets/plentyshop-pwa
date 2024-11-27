import { defineNuxtPlugin } from '#app';
import { CookieGroupFromNuxtConfig } from '~/configuration/cookie.config';

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) {
    const runtimeConfig = useRuntimeConfig();
    const initialCookies = runtimeConfig.public.cookieGroups as CookieGroupFromNuxtConfig;

    initialCookies.groups.forEach((cookieGroup) => {
      if (cookieGroup.name === 'CookieBar.functional.label') {
        cookieGroup.cookies.push({
          name: 'paypalModule.paypal',
          Provider: 'CookieBar.functional.cookies.payPal.provider',
          Status: 'CookieBar.functional.cookies.payPal.status',
          PrivacyPolicy: '/PrivacyPolicy',
          Lifespan: 'Session',
        });
      }
    });
  }
});
