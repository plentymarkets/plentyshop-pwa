import type { CategoryTreeItem, Page } from '~/composables/usePages/types';

export const usePages = async () => {
  const { locale } = useI18n();
  const { data } = useCategoryTree();

  const pages = useState<Page[]>('pages', () => []);
  const transformCategoryTreeToPages = () => {
    const transformData = (data: CategoryTreeItem[], parentPath = ''): Page[] => {
      const transformedData = data
        .map((item: CategoryTreeItem) => {
          if (!item.details || item.details.length === 0) {
            return null;
          }

          const detail = item.details[0];
          if (!detail) return null;

          const currentPath = `${parentPath}/${detail.nameUrl}`;

          const children = item.children ? transformData(item.children, currentPath) : undefined;

          return {
            id: item.id,
            name: detail.name,
            path: currentPath,
            children,
            type: item.type,
            right: item.right,
            parentCategoryId: item.parentCategoryId,
            sitemap: item.sitemap,
            linklist: item.linklist,
            canonicalLink: detail.canonicalLink ? detail.canonicalLink : '',
            position: detail.position ? detail.position : '',
            metaDescription: detail.metaDescription ? detail.metaDescription : '',
            metaKeywords: detail.metaKeywords ? detail.metaKeywords : '',
            metaRobots: detail.metaRobots ? detail.metaRobots : '',
          };
        })
        .filter(Boolean);

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
