import homepageTemplateDataEn from './homepageTemplateDataEn.json';
import homepageTemplateDataDe from './homepageTemplateDataDe.json';

const getHomepageTemplateData = (locale: string) => {
  if (locale === 'de') {
    return homepageTemplateDataDe;
  }
  return homepageTemplateDataEn;
};

export default async function useHomepageData() {
  const { $i18n } = useNuxtApp();
  const homepageTemplateData = getHomepageTemplateData($i18n.locale.value);
  const recommendedProductsCategories = ref(homepageTemplateData.featured);

  return {
    recommendedProductsCategories,
    getHomepageTemplateData,
  };
}
