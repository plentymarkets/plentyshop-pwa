import { defineI18nLocale } from '#i18n';
import translations from './bg.json';

export default defineI18nLocale(async () => {
  const config = useRuntimeConfig().public;
  let remoteTranslations = {};

  if (config.fetchDynamicTranslations) {
    const { data, fetchTranslations } = useTranslations();

    await fetchTranslations('bg');

    remoteTranslations = JSON.parse(data?.value) || {};
  }

  return {
    ...translations,
    ...remoteTranslations,
  };
});
