export const fetchHomepageTemplate = async (homepageCategoryId: number): Promise<unknown> => {
  const homepageTemplateData = ref({});
  const { fetchCategoryTemplate } = useCategoryTemplate();
  const { data } = await fetchCategoryTemplate(homepageCategoryId);
  const parsedData = JSON.parse(data || '{}');

  homepageTemplateData.value = {
    hero: parsedData.hero || [],
    valueProposition: parsedData.valueProposition,
    featured: parsedData.featured,
  };

  return homepageTemplateData.value;
};
