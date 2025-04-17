// // // composables/usePages.ts
import type { CategoryTreeItem } from '~/composables/usePages/types';
import { generateMockPagesAndCategories } from '~/composables/usePages/mock';

export const usePages = async () => {
  const { t, locale } = useI18n();

  const { mockPages, mockCategories } = generateMockPagesAndCategories();

  const pages = useState<Page[]>('pages', () => []);
  const contentPages = useState<Page[]>('contentPages', () => []);
  const productCategories = useState<Page[]>('productCategories', () => []);
  const contentLimit = useState<number>('contentLimit', () => 1);
  const categoryLimit = useState<number>('categoryLimit', () => 1);
  const childrenLimitMap = useState<Record<number, number>>('childrenLimitMap', () => ({}));

  const transformCategoryTreeToPages = () => {
    const transformData = (
      data: CategoryTreeItem[],
      parentPath = '',
      isRoot = true,
      parentId?: number
    ): Page[] => {
      let items = data
        .map((item: CategoryTreeItem) => {
          if (!item.details || item.details.length === 0) return null;
  
          const currentPath = `${parentPath}/${item.details[0].nameUrl}`;
  
          const children = item.children
            ? transformData(item.children, currentPath, false, item.id)
            : undefined;
  
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
            canonicalLink: item.details[0].canonicalLink ?? '',
            position: item.details[0].position ?? '',
            metaDescription: item.details[0].metaDescription ?? '',
            metaKeywords: item.details[0].metaKeywords ?? '',
            metaRobots: item.details[0].metaRobots ?? '',
          };
        })
        .filter(Boolean) as Page[];
  
      if (isRoot) {
        const limit = parentId === undefined && data[0]?.type === 'content' ? contentLimit.value : categoryLimit.value;
        console.log('Limit:', limit, 'Items:', items); // Debugging
        items = items.slice(0, limit);
      } else if (parentId !== undefined) {
        const limit = childrenLimitMap.value[parentId] || 1;
        items = items.slice(0, limit);
      }
  
      if (
        isRoot &&
        !items.some((page) => page && page.name.toLowerCase() === 'homepage')
      ) {
        items.unshift({
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
  
      return items;
    };
  
    contentPages.value = transformData(mockPages);
    productCategories.value = transformData(mockCategories);
    pages.value = [...contentPages.value, ...productCategories.value];
  };
  const loadMoreContent = () => {
    contentLimit.value += 1;
    transformCategoryTreeToPages();
  };

  const loadMoreCategories = () => {
    categoryLimit.value += 1;
    transformCategoryTreeToPages();
  };

  const loadMoreChildren = (parentId: number) => {
    if (!childrenLimitMap.value[parentId]) {
      childrenLimitMap.value[parentId] = 1;
    }
    childrenLimitMap.value[parentId] += 1;
    transformCategoryTreeToPages();
  };

  if (pages.value.length === 0) {
    transformCategoryTreeToPages();
  }

  watch(locale, () => {
    transformCategoryTreeToPages();
  });

  return {
    pages,
    contentPages,
    productCategories,
    loadMoreContent,
    loadMoreCategories,
    loadMoreChildren,
    childrenLimitMap,
  };
};


// DB  
// import type { CategoryTreeItem } from '~/composables/usePages/types';

// export const usePages = async () => {
//   const { t, locale } = useI18n();
//   const { data } = useCategoryTree();

//   const pages = useState<Page[]>('pages', () => []);
//   const contentPages = useState<Page[]>('contentPages', () => []);
//   const productCategories = useState<Page[]>('productCategories', () => []);
//   const contentLimit = useState<number>('contentLimit', () => 1);
//   const categoryLimit = useState<number>('categoryLimit', () => 1);
//   const childrenLimitMap = useState<Record<number, number>>('childrenLimitMap', () => ({}));

//   const transformCategoryTreeToPages = () => {
//     const transformData = (
//       data: CategoryTreeItem[],
//       parentPath = '',
//       isRoot = true,
//       parentId?: number
//     ): Page[] => {
//       let items = data
//         .map((item: CategoryTreeItem) => {
//           if (!item.details || item.details.length === 0) return null;

//           const currentPath = `${parentPath}/${item.details[0].nameUrl}`;

//           const children = item.children
//             ? transformData(item.children, currentPath, false, item.id)
//             : undefined;

//           return {
//             id: item.id,
//             name: item.details[0].name,
//             path: currentPath,
//             children,
//             type: item.type,
//             right: item.right,
//             parentCategoryId: item.parentCategoryId,
//             sitemap: item.sitemap,
//             linklist: item.linklist,
//             canonicalLink: item.details[0].canonicalLink ?? '',
//             position: item.details[0].position ?? '',
//             metaDescription: item.details[0].metaDescription ?? '',
//             metaKeywords: item.details[0].metaKeywords ?? '',
//             metaRobots: item.details[0].metaRobots ?? '',
//           };
//         })
//         .filter(Boolean) as Page[];

//       if (isRoot) {
//         const limit = parentId === undefined && data[0]?.type === 'content' ? contentLimit.value : categoryLimit.value;
//         items = items.slice(0, limit);
//       } else if (parentId !== undefined) {
//         const limit = childrenLimitMap.value[parentId] || 1;
//         items = items.slice(0, limit);
//       }

//       if (
//         isRoot &&
//         !items.some((page) => page && page.name.toLowerCase() === 'homepage')
//       ) {
//         items.unshift({
//           id: 1,
//           name: t('homepage.title'),
//           path: '/',
//           children: undefined,
//           type: 'content',
//           right: 'all',
//           parentCategoryId: '',
//           sitemap: '',
//           linklist: '',
//           canonicalLink: '',
//           position: '',
//           metaDescription: '',
//           metaKeywords: '',
//           metaRobots: '',
//         });
//       }

//       return items;
//     };

//     contentPages.value = transformData(data.value.filter((item) => item.type === 'content'));
//     productCategories.value = transformData(data.value.filter((item) => item.type === 'item'));
//     pages.value = [...contentPages.value, ...productCategories.value];
//   };

//   const loadMoreContent = () => {
//     contentLimit.value += 1;
//     transformCategoryTreeToPages();
//   };

//   const loadMoreCategories = () => {
//     categoryLimit.value += 1;
//     transformCategoryTreeToPages();
//   };

//   const loadMoreChildren = (parentId: number) => {
//     if (!childrenLimitMap.value[parentId]) {
//       childrenLimitMap.value[parentId] = 1;
//     }
//     childrenLimitMap.value[parentId] += 1;
//     transformCategoryTreeToPages();
//   };

//   if (pages.value.length === 0) {
//     transformCategoryTreeToPages();
//   }

//   watch(locale, () => {
//     transformCategoryTreeToPages();
//   });

//   watch(data, () => {
//     transformCategoryTreeToPages();
//   });

//   return {
//     pages,
//     contentPages,
//     productCategories,
//     loadMoreContent,
//     loadMoreCategories,
//     loadMoreChildren,
//     childrenLimitMap,
//   };
// };