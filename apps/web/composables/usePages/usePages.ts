import type { CategoryTreeItem } from '~/composables/usePages/types';

export const usePages = async () => {
  const { locale } = useI18n();
  const { data } = useCategoryTree();

  const pages = useState<Page[]>('pages', () => []);
  const contentPages = useState<Page[]>('contentPages', () => []);
  const itemPages = useState<Page[]>('itemPages', () => []);
  const childrenMap = useState<Record<number, Page[]>>('childrenMap', () => ({}));
  const childrenLimitMap = useState<Record<number, number>>('childrenLimitMap', () => ({})); 
  let contentLimit = 1;
  let itemLimit = 1;

  const transformCategoryTreeToPages = () => {
    const allPages: Page[] = [];
    const contentData: Page[] = [];
    const itemData: Page[] = [];
    const tempChildrenMap: Record<number, Page[]> = {};

    const transformData = (data: CategoryTreeItem[], parentPath = '', parentId: number | null = null) => {
      data.forEach((item: CategoryTreeItem) => {
        if (!item.details || item.details.length === 0) {
          return;
        }

        const currentPath = `${parentPath}/${item.details[0].nameUrl}`;
        const page: Page = {
          id: item.id,
          name: item.details[0].name,
          path: currentPath,
          children: undefined,
          type: item.type,
          right: item.right,
          parentCategoryId: item.parentCategoryId,
          sitemap: item.sitemap,
          linklist: item.linklist,
          canonicalLink: item.details[0].canonicalLink || '',
          position: item.details[0].position || '',
          metaDescription: item.details[0].metaDescription || '',
          metaKeywords: item.details[0].metaKeywords || '',
          metaRobots: item.details[0].metaRobots || '',
        };

        allPages.push(page);

        if (item.type === 'content' && contentData.length < contentLimit) {
          contentData.push(page);
        } else if (item.type === 'item' && itemData.length < itemLimit) {
          itemData.push(page);
        }

        if (parentId !== null) {
          if (!tempChildrenMap[parentId]) {
            tempChildrenMap[parentId] = [];
          }
          tempChildrenMap[parentId].push(page);
        }

        if (item.children) {
          transformData(item.children, currentPath, item.id);
        }
      });
    };

    transformData(data.value);

    pages.value = allPages;
    contentPages.value = contentData;
    itemPages.value = itemData;
    childrenMap.value = tempChildrenMap;
  };

  const getLimitedChildren = (parentId: number): Page[] => {
    const children = childrenMap.value[parentId] || [];
    const limit = childrenLimitMap.value[parentId] || 1; 
    return children.slice(0, limit);
  };

  const loadMoreChildren = (parentId: number) => {
    if (!childrenLimitMap.value[parentId]) {
      childrenLimitMap.value[parentId] = 1; 
    }
    childrenLimitMap.value[parentId] += 1; 
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

  const loadMoreContentPages = () => {
    contentLimit += 1;
    transformCategoryTreeToPages();
  };

  const loadMoreItemPages = () => {
    itemLimit += 1;
    transformCategoryTreeToPages();
  };

  return {
    pages,
    contentPages,
    itemPages,
    childrenMap,
    childrenLimitMap,
    getLimitedChildren,
    loadMoreChildren,
    loadMoreContentPages,
    loadMoreItemPages,
  };
};