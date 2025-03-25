import type { CategoryTreeItem } from '@plentymarkets/shop-api';
export const usePages = async () => {
  const { t, locale } = useI18n();
  const { data } = useCategoryTree();

  const pages = useState<
    {
      id: number;
      parentId: number; 
      name: string;
      path: string;
      children?: { id: number; name: string; path: string }[];
      type: string | undefined;
    }[]
  >('pages', () => []);

  const transformCategoryTreeToPages = () => {
    const transformData = (
      data: CategoryTreeItem[],
      parentPath = '',
      isRoot = true,
    ): {
      id: number;
      parentId: number;
      name: string;
      path: string;
      children?: { id: number;  name: string; path: string }[];
      type: string | undefined;
    }[] => {
      const transformedData = data
        .map((item: CategoryTreeItem) => {
          if (!item.details || item.details.length === 0) {
            return null;
          }

          const currentPath = `${parentPath}/${item.details[0].nameUrl}`;

          const children = item.children ? transformData(item.children, currentPath, false) : undefined;

          return {
            id: item.id,
            parentId: item.parentId,
            name: item.details[0].name,
            path: currentPath,
            children,
            type: item.type,
          };
        })
        .filter(Boolean);

      if (isRoot && !transformedData.some((page) => page && page.name === 'Homepage')) {
        transformedData.unshift({
          id: 1,
          parentId: 2,
          name: t('homepage.title'),
          path: '/',
          children: undefined,
          type: 'content',
        });
      }

      return transformedData as {
        id: number;
        parentId: number;
        name: string;
        path: string;
        children?: { id: number; parentId: number; name: string; path: string }[] | undefined;
        type: string;
      }[];
    };

    pages.value = transformData(data.value);
  };

  if (pages.value.length === 0) {
    await transformCategoryTreeToPages();
  }

  watch(locale, async () => {
    await transformCategoryTreeToPages();
  });

  watch(data, async () => {
    await transformCategoryTreeToPages();
  });

  return {
    pages,
  };
};
