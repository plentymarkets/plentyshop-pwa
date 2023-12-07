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
          name: 'plentyID',
          Provider: 'plentysystems AG',
          Status: 'Stores information about the current session, for example if the user is logged in.',
          PrivacyPolicy: '/PrivacyPolicy',
          // Lifespan must respect this format, currently only accepts days.
          Lifespan: 'Session',
          accepted: true,
        },
        {
          name: 'vsf-locale',
          Provider: 'plentysystems AG',
          Status: 'Stores the display language.',
          PrivacyPolicy: '/PrivacyPolicy',
          Lifespan: 'Session',
          accepted: true,
        },
        {
          name: 'consent-cookie',
          Provider: 'plentysystems AG',
          Status: 'Stores consent selection.',
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
      cookies: [
        {
          name: 'Script demo',
          Provider: 'plentysystems AG',
          Status: 'Example cookie that loads a hello world script if accepted.',
          PrivacyPolicy: '/PrivacyPolicy',
          Lifespan: 'Session',
          script: ['loadExampleScript'],
        },
      ],
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
