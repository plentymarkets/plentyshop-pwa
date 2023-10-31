import {
  SfIconCall,
  SfIconContactSupport,
  SfIconFacebook,
  SfIconHelp,
  SfIconInstagram,
  SfIconTwitter,
  SfIconYoutube,
} from '@storefront-ui/vue';
import SfLinkedin from '~/components/ui/Icons/IconLinkedin.vue';

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
    key: 'legal',
    subcategories: [
      {
        key: 'termsAndConditions',
        link: '/TermsAndConditions',
      },
      {
        key: 'cancellationRights',
        link: '/CancellationRights',
      },
      {
        key: 'legalDisclosure',
        link: '/LegalDisclosure',
      },
      {
        key: 'privacyPolicy',
        link: '/PrivacyPolicy',
      },
      {
        key: 'cancellationForm',
        link: '/CancellationForm',
      },
    ],
  },
  {
    key: 'contact',
    subcategories: [
      {
        key: 'contact',
        link: '/contact',
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
    label: 'Linkedin',
    link: 'https://www.linkedin.com/company/plentysystems',
    icon: SfLinkedin,
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
