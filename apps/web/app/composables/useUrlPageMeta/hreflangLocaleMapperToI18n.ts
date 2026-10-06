const HrefLangLocaleToI18n = {
  no: 'nn',
  sv: 'se',
  zh: 'cn',
  cs: 'cz',
  vi: 'vn',
};

export const hreflangLocaleMapperToI18n = (locale: string): string => {
  return HrefLangLocaleToI18n[locale as keyof typeof HrefLangLocaleToI18n] || locale;
};
