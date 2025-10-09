import { defineI18nLocale } from '#i18n';
import translations from './pl.json';

export default defineI18nLocale(async () => {
  const config = useRuntimeConfig().public;
  let remoteTranslations = {};

  if (config.fetchDynamicTranslations) {
    const { data, fetchTranslations } = useTranslations();

    await fetchTranslations('pl');

    remoteTranslations = JSON.parse(data?.value) || {};
  }

  return {
    ...translations,
    ...remoteTranslations,
  };
});
