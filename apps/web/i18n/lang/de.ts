import { defineI18nLocale } from '#i18n';
import deLocale from './de.json';

export default defineI18nLocale(async (locale) => {
  const config = useRuntimeConfig().public;
  let remoteTranslations = {};

  if (config.fetchDynamicTranslations) {
    const { data, fetchTranslations } = useTranslations();
    await fetchTranslations(locale);

    remoteTranslations = JSON.parse(data?.value) || {};
  }

  return {
    ...deLocale,
    ...remoteTranslations,
  };
});
