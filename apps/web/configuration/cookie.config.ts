import type { CookieGroupFromNuxtConfig } from '@plentymarkets/shop-core';

const getHash = async (input: string): Promise<string> => {
  const buffer = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

const config = {
  barTitle: 'CookieBar.about.label',
  barDescription: 'CookieBar.about.description',
  groups: [
    {
      id: 0,
      name: 'CookieBar.essentials.label',
      accepted: true,
      showMore: false,
      description: 'CookieBar.essentials.description',
      cookies: [
        {
          name: 'CookieBar.essentials.cookies.payPal.name',
          Provider: 'CookieBar.essentials.cookies.payPal.provider',
          Status: 'CookieBar.essentials.cookies.payPal.status',
          PrivacyPolicy: '/PrivacyPolicy',
          Lifespan: 'Session',
          accepted: true,
        },
        {
          name: 'CookieBar.essentials.cookies.plentyId.name',
          Provider: 'CookieBar.essentials.cookies.plentyId.provider',
          Status: 'CookieBar.essentials.cookies.plentyId.status',
          PrivacyPolicy: '/PrivacyPolicy',
          Lifespan: 'Session',
          accepted: true,
        },
        {
          name: 'CookieBar.essentials.cookies.vsfLocale.name',
          Provider: 'CookieBar.essentials.cookies.vsfLocale.provider',
          Status: 'CookieBar.essentials.cookies.vsfLocale.status',
          PrivacyPolicy: '/PrivacyPolicy',
          Lifespan: 'Session',
          accepted: true,
        },
        {
          name: 'CookieBar.essentials.cookies.consentCookie.name',
          Provider: 'CookieBar.essentials.cookies.consentCookie.provider',
          Status: 'CookieBar.essentials.cookies.consentCookie.status',
          PrivacyPolicy: '/PrivacyPolicy',
          Lifespan: '100 days',
          accepted: true,
        },
        {
          name: 'CookieBar.essentials.cookies.cloudflareTurnstile.name',
          Provider: 'CookieBar.essentials.cookies.cloudflareTurnstile.provider',
          Status: 'CookieBar.essentials.cookies.cloudflareTurnstile.status',
          PrivacyPolicy: '/PrivacyPolicy',
          Lifespan: '100 days',
          accepted: true,
        },
      ],
    },
    {
      id: 1,
      name: 'CookieBar.externalMedia.label',
      showMore: false,
      description: 'CookieBar.externalMedia.description',
      cookies: [],
    },
    {
      id: 2,
      name: 'CookieBar.functional.label',
      showMore: false,
      description: 'CookieBar.functional.description',
      cookies: [],
    },
    {
      id: 3,
      name: 'CookieBar.marketing.label',
      showMore: false,
      description: 'CookieBar.marketing.description',
      cookies: [],
    },
  ],
};

const cookieConfig = {
  configHash: await getHash(JSON.stringify(config)),
  ...config,
};

export default cookieConfig as CookieGroupFromNuxtConfig;
