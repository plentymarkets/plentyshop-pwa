export const categories = [
  {
    key: 'content',
    subcategories: [
      {
        key: 'kelloggsHistory',
        link: paths.home, // No matching path, so using home
      },
      {
        key: 'betterDays',
        link: paths.home, // No matching path, so using home
      },
      {
        key: 'pringles',
        link: paths.home, // No matching path, so using home
      },
      {
        key: 'breakfast',
        link: paths.home, // No matching path, so using home
      },
    ],
  },
  {
    key: 'service',
    subcategories: [
      {
        key: 'paymentAndShipping',
        link: paths.home, // No matching path, so using home
      },
      {
        key: 'faq',
        link: paths.home, // No matching path, so using home
      },
    ],
  },
  {
    key: 'legal',
    subcategories: [
      {
        key: 'legalDisclosure',
        link: paths.legalDisclosure,
      },
      {
        key: 'privacyPolicy',
        link: paths.privacyPolicy,
      },
      {
        key: 'termsAndConditions',
        link: paths.termsAndConditions,
      },
    ],
  },
];