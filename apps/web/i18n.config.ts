export default defineI18nConfig(() => ({
  fallbackLocale: 'en',
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
}));
