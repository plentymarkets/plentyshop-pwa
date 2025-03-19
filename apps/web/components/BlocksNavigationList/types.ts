import type { Block } from '@plentymarkets/shop-api';

export type BlocksList = {
  [key: string]: {
    category: string;
    title: string;
    blockName: string;
    variations: {
      title: string;
      image: string;
      template: {
        en: Block;
        de: Block;
      };
    }[];
  };
};

export interface Category {
  title: string;
  blockName: string;
  category: string;
  variations: Variation[];
}

interface Variation {
  image: string;
  title: string;
}
