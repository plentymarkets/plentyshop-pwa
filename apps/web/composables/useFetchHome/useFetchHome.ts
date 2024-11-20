const fetchHomepageTemplate = async (homepageCategoryId: number) => {
  const { fetchCategoryTemplate } = useCategoryTemplate();
  const { data } = await fetchCategoryTemplate(homepageCategoryId);
  const parsedData = JSON.parse(data || '{}');

  return {
    hero: parsedData.hero || [],
    valueProposition: parsedData.valueProposition,
    featured: parsedData.featured,
  };
};

export const useFetchHome = () => {
  return {
    fetchHomepageTemplate,
  };
};
