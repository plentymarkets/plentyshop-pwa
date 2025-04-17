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
        nameUrl: path.slice(1),
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

const generateChildrenFor48 = (parentPath: string, forceType?: 'item' | 'content'): CategoryTreeItem[] => {
  const children: CategoryTreeItem[] = [];
  for (let i = 1; i <= 100; i++) {
    const name = `${i} kid of 48`;
    const child = generateCategory(name, parentPath, 1, forceType);

    // 25th kid gets its own 20 children
    if (i === 25) {
      child.children = [];
      for (let j = 1; j <= 20; j++) {
        const subName = `${j} kid of ${i} kid of 48`;
        const subChild = generateCategory(subName, `${parentPath}/${name}`, 2, forceType);
        child.children.push(subChild);
      }
      child.childCount = child.children.length;
    }

    children.push(child);
  }
  return children;
};

const generateMockSet = (type: 'item' | 'content'): CategoryTreeItem[] => {
  const nodes: CategoryTreeItem[] = [];

  for (let i = 1; i <= 200; i++) {
    const name = `${type === 'content' ? 'Page' : 'Category'} ${i}`;
    const node = generateCategory(name, '', 0, type);

    if (i === 48) {
      node.children = generateChildrenFor48(node.details[0].nameUrl, type);
      node.childCount = node.children.length;
    }

    nodes.push(node);
  }

  return nodes;
};

export const generateMockPagesAndCategories = () => {
  const mockPages: CategoryTreeItem[] = generateMockSet('content');
  const mockCategories: CategoryTreeItem[] = generateMockSet('item');

  return {
    mockPages,
    mockCategories,
  };
};
