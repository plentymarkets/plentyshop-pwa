import {
  SfIconCall,
  SfIconContactSupport,
  SfIconFacebook,
  SfIconHelp,
  SfIconInstagram,
  SfIconTwitter,
  SfIconYoutube,
} from '@storefront-ui/vue';

export const categories = [
  {
    key: 'howToBuy',
    subcategories: [
      {
        key: 'paymentMethods',
        link: '/',
      },
      {
        key: 'orderPickup',
        link: '/',
      },
      {
        key: 'purchaseStatus',
        link: '/',
      },
      {
        key: 'trackOrders',
        link: '/',
      },
      {
        key: 'returns',
        link: '/',
      },
    ],
  },
  {
    key: 'help',
    subcategories: [
      {
        key: 'helpCenter',
        link: '/',
      },
      {
        key: 'securityFraud',
        link: '/',
      },
      {
        key: 'feedback',
        link: '/',
      },
      {
        key: 'contact',
        link: '/',
      },
    ],
  },
  {
    key: 'services',
    subcategories: [
      {
        key: 'giftCards',
        link: '/',
      },
      {
        key: 'storeLocator',
        link: '/',
      },
      {
        key: 'clickCollect',
        link: '/',
      },
      {
        key: 'sameDayDelivery',
        link: '/',
      },
      {
        key: 'shippingDelivery',
        link: '/',
      },
      {
        key: 'couponsDiscounts',
        link: '/',
      },
      {
        key: 'newsletter',
        link: '/',
      },
    ],
  },
  {
    key: 'about',
    subcategories: [
      {
        key: 'aboutUs',
        link: '/',
      },
      {
        key: 'jobs',
        link: '/',
      },
      {
        key: 'pressCenter',
        link: '/',
      },
      {
        key: 'affiliateProgram',
        link: '/',
      },
      {
        key: 'suppliers',
        link: '/',
      },
    ],
  },
];
export const socialMedia = [
  {
    label: 'Facebook',
    link: 'https://www.facebook.com/plentymarkets',
    icon: SfIconFacebook,
  },
  {
    label: 'Twitter',
    link: 'https://twitter.com/plentymarkets',
    icon: SfIconTwitter,
  },
  {
    label: 'Instagram',
    link: 'https://www.instagram.com/plentysystems',
    icon: SfIconInstagram,
  },
  {
    label: 'Youtube',
    link: 'https://www.youtube.com/channel/UCauJsvmhbPNp6ii7tCGwxMg',
    icon: SfIconYoutube,
  },
];
export const contactOptions = [
  {
    key: 'helpCenter',
    link: '/',
    details: ['description'],
    icon: SfIconHelp,
  },
  {
    key: 'liveChat',
    link: '/',
    details: ['openingHours-1', 'openingHours-2'],
    icon: SfIconContactSupport,
  },
  {
    key: 'phone',
    link: '/',
    details: ['openingHours-1', 'openingHours-2'],
    icon: SfIconCall,
  },
];
export const bottomLinks = [
  {
    key: 'terms',
    link: '/',
  },
  {
    key: 'privacyPolicy',
    link: '/',
  },
];
export const companyName = `© PLENTYSYSTEMS AG ${new Date().getFullYear()}`;
