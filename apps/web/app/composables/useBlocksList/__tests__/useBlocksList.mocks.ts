import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import type { Block } from '@plentymarkets/shop-api';
import type { BlocksList, BlockListCategory, BlockTemplate } from '../types';

export const mockCategoryTemplateBlocks: Block[] = [
  {
    name: 'TestBlock',
    type: 'test',
    meta: { uuid: 'test-uuid-1' },
    content: [],
  },
  {
    name: 'ParentBlock',
    type: 'parent',
    meta: { uuid: 'test-uuid-2' },
    content: [
      {
        name: 'NestedBlock',
        type: 'nested',
        meta: { uuid: 'test-uuid-3' },
        content: [],
      },
    ],
  },
];

export const mockExpectedEnglishTemplate: BlockTemplate = {
  name: 'HeroBanner',
  type: 'content',
  meta: { uuid: 'banner-uuid-1' },
  content: { title: 'Welcome' },
};

export const mockExpectedGermanTemplate: BlockTemplate = {
  name: 'HeroBanner',
  type: 'content',
  meta: { uuid: 'banner-uuid-1' },
  content: { title: 'Willkommen' },
};

export const getMockBlocksList = (): BlocksList => ({
  banners: {
    title: 'Banners',
    blockName: 'Banner',
    category: 'banners',
    variations: [
      {
        image: 'banner.png',
        title: 'Hero Banner',
        template: {
          en: mockExpectedEnglishTemplate,
          de: mockExpectedGermanTemplate,
        },
      },
    ],
  },
});

export const mockBlockCategories = {
  contentBlocks: {
    title: 'Content Blocks',
    blockName: 'ContentBlock',
    category: 'content',
    accessControl: ['content'],
    variations: [],
  } as BlockListCategory,
  productBlocks: {
    title: 'Product Blocks',
    blockName: 'ProductBlock',
    category: 'product',
    accessControl: ['product'],
    variations: [],
  } as BlockListCategory,
  universalBlocks: {
    title: 'Universal Blocks',
    blockName: 'UniversalBlock',
    category: 'universal',
    variations: [],
  } as BlockListCategory,
};

export const mockCategory: BlockListCategory = {
  title: 'Test Category',
  blockName: 'TestBlock',
  category: 'test',
  accessControl: ['content'],
  variations: [],
};

export const setupNuxtMocks = () => {
  mockNuxtImport('useNuxtApp', () => () => ({
    $i18n: {
      locale: {
        value: 'en',
      },
    },
  }));
};
