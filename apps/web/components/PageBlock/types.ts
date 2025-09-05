import type { Block } from '@plentymarkets/shop-api';

export interface PageBlockProps {
  index: number;
  block: Block;
  disableActions: boolean;
  root: boolean;
  isClicked: boolean;
  clickedBlockIndex: number | null;
  isTablet: boolean;
  blockHasData?: (block: Block) => boolean;
  changeBlockPosition: (index: number, position: number) => void;
}

export interface LazyLoadConfig {
  propName: string;
  rootMargin?: string;
  threshold?: number;
}
