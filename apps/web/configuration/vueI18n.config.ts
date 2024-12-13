export default {
  fallbackLocale: process.env.DEFAULTLANGUAGE ?? 'en',
  detectBrowserLanguage: false,
  numberFormats: {
    en: {
      currency: {
        style: 'currency',
        currency: 'GBP',
        currencyDisplay: 'symbol',
      },
    },
    de: {
      currency: {
        style: 'currency',
        currency: 'EUR',
        currencyDisplay: 'symbol',
      },
    },
  },
};
