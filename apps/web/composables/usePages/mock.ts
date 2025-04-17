import type { CategoryTreeItem } from '~/composables/usePages/types';

let idCounter = 1;

const generateCategory = (
  name: string,
  parentPath = '',
  depth = 0,
  forceType: 'item' | 'content' = depth % 2 === 0 ? 'item' : 'content'
): CategoryTreeItem => {
  const path = `${parentPath}/${name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`;

  return {
    id: idCounter++,
    name,
    details: [
      {
        name,
        nameUrl: path.slice(1), // remove leading slash
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
    type: forceType,
    right: 'all',
    parentCategoryId: undefined,
    sitemap: '',
    linklist: '',
    itemCount: [],
    childCount: 0,
    children: undefined,
  };
};

const generateNested = (
  count = 5,
  childrenPerLevel = 3,
  maxDepth = 2,
  depth = 0,
  forceType?: 'item' | 'content'
): CategoryTreeItem[] => {
  const nodes: CategoryTreeItem[] = [];

  for (let i = 1; i <= count; i++) {
    const name = `${forceType === 'content' ? 'Page' : 'Category'} ${depth + 1}.${i}`;
    const node = generateCategory(name, '', depth, forceType);

    if (depth < maxDepth) {
      const children = generateNested(childrenPerLevel, childrenPerLevel, maxDepth, depth + 1, forceType);
      node.children = children;
      node.childCount = children.length;
    }

    nodes.push(node);
  }

  return nodes;
};

export const generateMockPagesAndCategories = () => {
  const mockPages: CategoryTreeItem[] = [
    generateCategory('Homepage', '', 0, 'content'),
    generateCategory('About Us', '', 0, 'content'),
    generateCategory('Contact', '', 0, 'content'),
    ...generateNested(3, 2, 2, 0, 'content'), // generate more nested content pages
  ];

  const mockCategories: CategoryTreeItem[] = generateNested(5, 3, 2, 0, 'item');

  return {
    mockPages,
    mockCategories,
  };
};
