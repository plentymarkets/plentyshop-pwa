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
        link: paths.home,
      },
      {
        key: 'orderPickup',
        link: paths.home,
      },
      {
        key: 'purchaseStatus',
        link: paths.home,
      },
      {
        key: 'trackOrders',
        link: paths.home,
      },
      {
        key: 'returns',
        link: paths.home,
      },
    ],
  },
  {
    key: 'legal',
    subcategories: [
      {
        key: 'termsAndConditions',
        link: paths.termsAndConditions,
      },
      {
        key: 'cancellationRights',
        link: paths.cancellationRights,
      },
      {
        key: 'legalDisclosure',
        link: paths.legalDisclosure,
      },
      {
        key: 'privacyPolicy',
        link: paths.privacyPolicy,
      },
      {
        key: 'cancellationForm',
        link: paths.cancellationForm,
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
    link: paths.home,
    details: ['description'],
    icon: SfIconHelp,
  },
  {
    key: 'liveChat',
    link: paths.home,
    details: ['openingHours-1', 'openingHours-2'],
    icon: SfIconContactSupport,
  },
  {
    key: 'phone',
    link: paths.home,
    details: ['openingHours-1', 'openingHours-2'],
    icon: SfIconCall,
  },
];
export const bottomLinks = [
  {
    key: 'terms',
    link: paths.home,
  },
  {
    key: 'privacyPolicy',
    link: paths.home,
  },
];
export const companyName = `© PLENTYSYSTEMS AG ${new Date().getFullYear()}`;
