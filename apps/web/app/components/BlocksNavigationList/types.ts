import type { Block } from '@plentymarkets/shop-api';

export type BlocksList = {
  [key: string]: Category;
};

export type BlocksListContext = 'content' | 'productCategory' | 'product' | '';

export interface Category {
  title: string;
  accessControl?: BlocksListContext;
  blockName: string;
  category: string;
  variations: Variation[];
}

export interface Variation {
  image: string;
  title: string;
  template: {
    en: Block;
    de: Block;
  };
}
