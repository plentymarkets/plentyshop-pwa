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
  barTitle: 'We value your privacy',
  barDescription:
    'We use cookies and similar technologies on our website and process personal data of visitors to our website (e.g. IP address), e.g. to personalise content and advertisements, to integrate media from third-party providers or to analyse access to our website. Data processing only takes place when cookies are set. We share this data with third parties that we name in the settings. Data processing may be carried out with consent or on the basis of a legitimate interest. Consent can be given or refused. There is a right not to consent and to change or withdraw consent at a later date. We provide more information about the use of personal data and the services in our',
  groups: [
    {
      id: 0,
      name: 'Essentials',
      accepted: false,
      showMore: false,
      description:
        'Essential cookies enable basic functions and are necessary for the proper functioning of the website.',
      cookies: [
        {
          name: 'Session',
          Provider: 'plentyShop LTS',
          Status: 'The consent cookies stores the user’s state of consent for cookies on our page.',
          PrivacyPolicy: '/PrivacyPolicy',
          // Lifespan must respect this format, currently only accepts days.
          Lifespan: '100 days',
          accepted: false,
        },
        {
          name: 'Consent',
          Provider: 'plentyShop LTS',
          Status: 'The consent cookies stores the user’s state of consent for cookies on our page.',
          PrivacyPolicy: '/PrivacyPolicy',
          Lifespan: '100 days',
          accepted: false,
        },
        {
          name: 'Session2',
          Provider: 'plentyShop LTS',
          Status: 'The consent cookies stores the user’s state of consent for cookies on our page.',
          PrivacyPolicy: '/PrivacyPolicy',
          Lifespan: '100 days',
          accepted: false,
        },
      ],
    },
    {
      id: 1,
      name: 'External Media',
      accepted: false,
      showMore: false,
      description:
        'Content by video platforms and social media platforms are blocked by default. If you accept cookies by external media, access to these contents requires no further consent.',
      cookies: [
        {
          name: 'Session',
          Provider: 'plentyShop LTS',
          Status: 'The consent cookies stores the user’s state of consent for cookies on our page.',
          PrivacyPolicy: '/PrivacyPolicy',
          Lifespan: '2 days',
          script: ['console.log(`Loaded cookie script example1`);', 'https://www.plentymarkets.com'],
          accepted: false,
        },
        {
          name: 'Consent',
          Provider: 'plentyShop LTS',
          Status: 'The consent cookies stores the user’s state of consent for cookies on our page.',
          PrivacyPolicy: '/PrivacyPolicy',
          Lifespan: '100 days',
          accepted: false,
        },
        {
          name: 'Session2',
          Provider: 'plentyShop LTS',
          Status: 'The consent cookies stores the user’s state of consent for cookies on our page.',
          PrivacyPolicy: '/PrivacyPolicy',
          Lifespan: '100 days',
          accepted: false,
        },
      ],
    },
    {
      id: 2,
      name: 'Functional',
      accepted: false,
      showMore: false,
      description:
        'Marketing cookies are used by third parties and publishers to display personalised advertisements by following users across websites.',
      cookies: [
        {
          name: 'Session',
          Provider: 'plentyShop LTS',
          Status: 'The consent cookies stores the user’s state of consent for cookies on our page.',
          PrivacyPolicy: '/PrivacyPolicy',
          Lifespan: '4 days',
          accepted: false,
        },
        {
          name: 'Consent',
          Provider: 'plentyShop LTS',
          Status: 'The consent cookies stores the user’s state of consent for cookies on our page.',
          PrivacyPolicy: '/PrivacyPolicy',
          Lifespan: '100 days',
          accepted: false,
        },
        {
          name: 'Session2',
          Provider: 'plentyShop LTS',
          Status: 'The consent cookies stores the user’s state of consent for cookies on our page.',
          PrivacyPolicy: '/PrivacyPolicy',
          Lifespan: '100 days',
          accepted: false,
        },
      ],
    },
    {
      id: 3,
      name: 'Marketing',
      accepted: false,
      showMore: false,
      description:
        'Marketing cookies are used by third parties and publishers to display personalised advertisements by following users across websites.',
      cookies: [
        {
          name: 'Session',
          Provider: 'plentyShop LTS',
          Status: 'The consent cookies stores the user’s state of consent for cookies on our page.',
          PrivacyPolicy: '/PrivacyPolicy',
          Lifespan: '100 days',
          accepted: false,
        },
        {
          name: 'Consent',
          Provider: 'plentyShop LTS',
          Status: 'The consent cookies stores the user’s state of consent for cookies on our page.',
          PrivacyPolicy: '/PrivacyPolicy',
          Lifespan: '100 days',
          accepted: false,
        },
        {
          name: 'Session2',
          Provider: 'plentyShop LTS',
          Status: 'The consent cookies stores the user’s state of consent for cookies on our page.',
          PrivacyPolicy: '/PrivacyPolicy',
          Lifespan: '100 days',
          accepted: false,
        },
      ],
    },
  ],
};
