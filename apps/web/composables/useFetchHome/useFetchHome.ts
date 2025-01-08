const fetchHomepageTemplate = () => {
  const { data } = useCategoryTemplate();
  const parsedData = JSON.parse(data?.value?.data || '{}');

  const blocks = parsedData.blocks || [];
  const meta = parsedData.meta || { isDefault: null };

  return {
    blocks,
    meta,
  };
};

export const useFetchHome = () => ({
  fetchHomepageTemplate,
});
