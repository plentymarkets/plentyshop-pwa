import { defineI18nLocale } from '#i18n';
import translations from './nl.json';

export default defineI18nLocale(async () => {
  const config = useRuntimeConfig().public;
  let remoteTranslations = {};

  if (config.fetchDynamicTranslations) {
    const { data, fetchTranslations } = useTranslations();

    await fetchTranslations('nl');

    remoteTranslations = JSON.parse(data?.value) || {};
  }

  return {
    ...translations,
    ...remoteTranslations,
  };
});
