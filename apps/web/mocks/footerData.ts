export const categories = [
  {
    key: 'howToBuy',
    subcategories: [
      {
        key: 'faqLink',
        link: paths.home,
      },
      {
        key: 'orderPickup',
        link: paths.home,
      },
      {
        key: 'returns',
        link: paths.home,
      },
      {
        key: 'paymentMethods',
        link: paths.home,
      },
      {
        key: 'gutscheinLink',
        link: paths.home,
      }
      
      /*{
        key: 'purchaseStatus',
        link: paths.home,
      },
      {
        key: 'trackOrders',
        link: paths.home,
      }*/
    ],
  },
  {
    key: 'contact',
    subcategories: [
      {
        key: 'contact',
        link: '/contact',
      },
      {
        key: 'ratgeberLink',
        link: '/ratgeber',
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
];

export const companyName = `© PLENTYSYSTEMS AG ${new Date().getFullYear()}`;
