import type { CategoryTreeItem } from '~/composables/usePages/types';

export const usePages = async () => {
  const { t, locale } = useI18n();
  const { data } = useCategoryTree();

  const pages = useState<Page[]>('pages', () => []);
  const transformCategoryTreeToPages = () => {
    const transformData = (data: CategoryTreeItem[], parentPath = '', isRoot = true): Page[] => {
      const transformedData = data
        .map((item: CategoryTreeItem) => {
          if (!item.details || item.details.length === 0) {
            return null;
          }

          const currentPath = `${parentPath}/${item.details[0].nameUrl}`;

          const children = item.children ? transformData(item.children, currentPath, false) : undefined;

          return {
            id: item.id,
            name: item.details[0].name,
            path: currentPath,
            children,
            type: item.type,
            right: item.right,
            parentCategoryId: item.parentCategoryId,
            sitemap: item.sitemap,
            linklist: item.linklist,
            canonicalLink: item.details[0].canonicalLink ? item.details[0].canonicalLink : '',
            position: item.details[0].position ? item.details[0].position : '',
            metaDescription: item.details[0].metaDescription ? item.details[0].metaDescription : '',
            metaKeywords: item.details[0].metaKeywords ? item.details[0].metaKeywords : '',
            metaRobots: item.details[0].metaRobots ? item.details[0].metaRobots : '',
          };
        })
        .filter(Boolean);

      if (isRoot && !transformedData.some((page) => page && page.name === 'Homepage')) {
        transformedData.unshift({
          id: 1,
          name: t('homepage.title'),
          path: '/',
          children: undefined,
          type: 'content',
          right: 'all',
          parentCategoryId: '',
          sitemap: '',
          linklist: '',
          canonicalLink: '',
          position: '',
          metaDescription: '',
          metaKeywords: '',
          metaRobots: '',
        });
      }

      return transformedData as {
        id: number;
        name: string;
        path: string;
        children?: Page[];
        type: string;
        right: string;
        parentCategoryId: string;
        sitemap: string;
        linklist: string;
        canonicalLink?: string;
        position?: string;
        metaDescription?: string;
        metaKeywords?: string;
        metaRobots?: string;
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
