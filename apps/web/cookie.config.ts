export interface Cookie {
  name: string;
  accepted?: boolean;
  Lifespan: string;
  script?: string[];
  Provider: string;
  Status: string;
  PrivacyPolicy: string;
}
export interface CookieGroup {
  id?: number;
  name: string;
  accepted: boolean;
  showMore?: boolean;
  description: string;
  cookies: Cookie[];
}
export interface CookieGroupFromNuxtConfig {
  groups: CookieGroup[];
  barTitle: string;
  barDescription: string;
}

export default {
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
          name: 'Session',
          Provider: 'plentyShop LTS',
          Status: 'The consent cookies stores the user’s state of consent for cookies on our page.',
          PrivacyPolicy: '/PrivacyPolicy',
          // Lifespan must respect this format, currently only accepts days.
          Lifespan: '100 days',
          accepted: true,
        },
        {
          name: 'Consent',
          Provider: 'plentyShop LTS',
          Status: 'The consent cookies stores the user’s state of consent for cookies on our page.',
          PrivacyPolicy: '/PrivacyPolicy',
          Lifespan: '100 days',
          accepted: true,
        },
        {
          name: 'Session2',
          Provider: 'plentyShop LTS',
          Status: 'The consent cookies stores the user’s state of consent for cookies on our page.',
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
      cookies: [
        {
          name: 'Session',
          Provider: 'plentyShop LTS',
          Status: 'The consent cookies stores the user’s state of consent for cookies on our page.',
          PrivacyPolicy: '/PrivacyPolicy',
          Lifespan: '2 days',
          script: ['console.log(`Loaded cookie script example1`);', 'https://www.plentymarkets.com'],
        },
        {
          name: 'Consent',
          Provider: 'plentyShop LTS',
          Status: 'The consent cookies stores the user’s state of consent for cookies on our page.',
          PrivacyPolicy: '/PrivacyPolicy',
          Lifespan: '100 days',
        },
        {
          name: 'Session2',
          Provider: 'plentyShop LTS',
          Status: 'The consent cookies stores the user’s state of consent for cookies on our page.',
          PrivacyPolicy: '/PrivacyPolicy',
          Lifespan: '100 days',
        },
      ],
    },
    {
      id: 2,
      name: 'CookieBar.functional.label',
      showMore: false,
      description: 'CookieBar.functional.description',
      cookies: [
        {
          name: 'Session',
          Provider: 'plentyShop LTS',
          Status: 'The consent cookies stores the user’s state of consent for cookies on our page.',
          PrivacyPolicy: '/PrivacyPolicy',
          Lifespan: '4 days',
        },
        {
          name: 'Consent',
          Provider: 'plentyShop LTS',
          Status: 'The consent cookies stores the user’s state of consent for cookies on our page.',
          PrivacyPolicy: '/PrivacyPolicy',
          Lifespan: '100 days',
        },
        {
          name: 'Session2',
          Provider: 'plentyShop LTS',
          Status: 'The consent cookies stores the user’s state of consent for cookies on our page.',
          PrivacyPolicy: '/PrivacyPolicy',
          Lifespan: '100 days',
        },
      ],
    },
    {
      id: 3,
      name: 'CookieBar.marketing.label',
      showMore: false,
      description: 'CookieBar.marketing.description',
      cookies: [
        {
          name: 'Session',
          Provider: 'plentyShop LTS',
          Status: 'The consent cookies stores the user’s state of consent for cookies on our page.',
          PrivacyPolicy: '/PrivacyPolicy',
          Lifespan: '100 days',
        },
        {
          name: 'Consent',
          Provider: 'plentyShop LTS',
          Status: 'The consent cookies stores the user’s state of consent for cookies on our page.',
          PrivacyPolicy: '/PrivacyPolicy',
          Lifespan: '100 days',
        },
        {
          name: 'Session2',
          Provider: 'plentyShop LTS',
          Status: 'The consent cookies stores the user’s state of consent for cookies on our page.',
          PrivacyPolicy: '/PrivacyPolicy',
          Lifespan: '100 days',
        },
      ],
    },
  ],
};
