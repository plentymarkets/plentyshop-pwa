export const usePages = async () => {
  const { t } = useI18n();
  const { getCategoryTree } = useCategoryTree();

  const data = await getCategoryTree();
  interface Category {
    details: { name: string; nameUrl: string }[];
    children?: Category[];
  }
  const transformData = (
    data: Category[],
    isRoot = true,
  ): { name: string; path: string; children?: { name: string; path: string }[] | undefined }[] => {
    const transformedData = data.map((item: Category) => ({
      name: item.details[0].name,
      path: `/${item.details[0].nameUrl}`,
      children: item.children ? transformData(item.children, false) : undefined,
    }));

    if (isRoot && !transformedData.some((page) => page.name === 'Homepage')) {
      transformedData.unshift({
        name: t('homepage.homepagetitle'),
        path: '/',
        children: undefined,
      });
    }

    return transformedData;
  };

  const pages = ref(transformData(data));

  return {
    pages,
  };
};
