const fetchHomepageTemplate = async (homepageCategoryId: number) => {
  const { fetchCategoryTemplate } = useCategoryTemplate();
  const { data } = await fetchCategoryTemplate(homepageCategoryId);
  const parsedData = JSON.parse(data || '{}');

  return {
    hero: parsedData.hero || [],
    mediaCard: parsedData.mediaCard,
    featured: parsedData.featured,
  };
};

export const useFetchHome = () => {
  return {
    fetchHomepageTemplate,
  };
};
