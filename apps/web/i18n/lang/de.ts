import { defineI18nLocale } from '#i18n';
const localeFiles = import.meta.glob('./*.json', { eager: true, import: 'default' });

export default defineI18nLocale(async (locale) => {
  const config = useRuntimeConfig().public;
  let remoteTranslations = {};

  const defaultLocale = localeFiles[`./${locale}.json`] ?? {};

  if (config.fetchDynamicTranslations) {
    const { data, fetchTranslations } = useTranslations();

    await fetchTranslations(locale);

    remoteTranslations = JSON.parse(data?.value) || {};
  }

  return {
    ...defaultLocale,
    ...remoteTranslations,
  };
});
