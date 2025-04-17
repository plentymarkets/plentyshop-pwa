// import type { CategoryTreeItem } from '~/composables/usePages/types';
 // V
// export const generateMockPages = (): CategoryTreeItem[] => {
//   const mockPages: CategoryTreeItem[] = [];

//   for (let i = 1; i <= 200; i++) {
//     const hasChildren = i % 10 === 0; // Every 10th page will have children
//     const children = hasChildren
//       ? Array.from({ length: 5 }, (_, index) => ({
//           id: i * 100 + index + 1,
//           name: `Child ${index + 1} of Page ${i}`,
//           details: [
//             {
//               name: `Child ${index + 1} of Page ${i}`,
//               nameUrl: `child-${index + 1}`,
//               canonicalLink: '',
//               position: '',
//               metaDescription: '',
//               metaKeywords: '',
//               metaRobots: '',
//               lang: '',
//               metaTitle: '',
//               imagePath: null,
//               image2Path: null,
//             },
//           ],
//           type: index % 2 === 0 ? 'content' : 'item',
//           right: 'all',
//           parentCategoryId: i.toString(),
//           sitemap: '',
//           linklist: '',
//           itemCount: [],
//           childCount: 0,
//           children: undefined, // No nested children for simplicity
//         }))
//       : undefined;

//     mockPages.push({
//       id: i,
//       name: `Page ${i}`,
//       details: [
//         {
//           name: `Page ${i}`,
//           nameUrl: `page-${i}`,
//           canonicalLink: '',
//           position: '',
//           metaDescription: '',
//           metaKeywords: '',
//           metaRobots: '',
//           lang: '',
//           metaTitle: '',
//           imagePath: null,
//           image2Path: null
//         },
//       ],
//       type: i % 2 === 0 ? 'content' : 'item',
//       right: 'all',
//       parentCategoryId: undefined,
//       itemCount: [],
//       childCount: hasChildren ? 5 : 0,
//       children,
//       linklist: '',
//     });
//   }

//   return mockPages;
// };


/// Version 2 

// import type { CategoryTreeItem } from '~/composables/usePages/types';

// export const generateMockPages = (): CategoryTreeItem[] => {
//   const mockPages: CategoryTreeItem[] = [];

//   for (let i = 1; i <= 200; i++) {
//     mockPages.push({
//       id: i,
//       name: `Page ${i}`,
//       details: [
//         {
//           name: `Page ${i}`,
//           nameUrl: `page-${i}`,
//           canonicalLink: '',
//           position: '',
//           metaDescription: '',
//           metaKeywords: '',
//           metaRobots: '',
//           lang: '',
//           metaTitle: '',
//           imagePath: null,
//           image2Path: null,
//         },
//       ],
//       type: i % 2 === 0 ? 'content' : 'item', // Alternate between 'content' and 'item'
//       right: 'all',
//       parentCategoryId: null, // No parent since these are top-level pages
//       sitemap: '',
//       linklist: '',
//       itemCount: [],
//       childCount: 0, // No children
//       children: undefined, // Explicitly set to undefined
//     });
//   }

//   return mockPages;
// };

import type { CategoryTreeItem } from '~/composables/usePages/types';

export const generateMockPages = (): CategoryTreeItem[] => {
  const mockPages: CategoryTreeItem[] = [];

  for (let i = 1; i <= 200; i++) {
    const isPage10 = i === 10;
    const children = isPage10
      ? Array.from({ length: 50 }, (_, index) => ({
          id: i * 100 + index + 1,
          name: `Child ${index + 1} of Page ${i}`,
          details: [
            {
              name: `Child ${index + 1} of Page ${i}`,
              nameUrl: `child-${index + 1}-of-page-${i}`,
              canonicalLink: '',
              position: '',
              metaDescription: '',
              metaKeywords: '',
              metaRobots: '',
              lang: '',
              metaTitle: '',
              imagePath: null,
              image2Path: null,
            },
          ],
          type: index % 2 === 0 ? 'content' : 'item',
          right: 'all',
          parentCategoryId: i.toString(),
          sitemap: '',
          linklist: '',
          itemCount: [],
          childCount: 0,
          children: undefined,
        }))
      : undefined;

    mockPages.push({
      id: i,
      name: `Page ${i}`,
      details: [
        {
          name: `Page ${i}`,
          nameUrl: `page-${i}`,
          canonicalLink: '',
          position: '',
          metaDescription: '',
          metaKeywords: '',
          metaRobots: '',
          lang: '',
          metaTitle: '',
          imagePath: null,
          image2Path: null,
        },
      ],
      type: i % 2 === 0 ? 'content' : 'item',
      right: 'all',
      parentCategoryId: undefined,
      sitemap: '',
      linklist: '',
      itemCount: [],
      childCount: isPage10 ? 3 : 0,
      children,
    });
  }

  return mockPages;
};
