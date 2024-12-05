const fetchHomepageTemplate = () => {
  const { data } = useCategoryTemplate();
  const parsedData = JSON.parse(data?.value?.data || '{}');
  const blocks = parsedData.blocks || [];

  return { blocks };
};

export const useFetchHome = () => {
  return {
    fetchHomepageTemplate,
  };
};
