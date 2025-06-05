import { defineI18nLocale } from '#i18n';

export default defineI18nLocale(async (locale) => {
  const { data, fetchTranslations } = useTranslations();

  await fetchTranslations(locale);
  console.log('test:', data.value);

  return data.value;
});
