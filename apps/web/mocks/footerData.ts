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

export const companyName = `© PLENTYSYSTEMS AG ${new Date().getFullYear()}`;
