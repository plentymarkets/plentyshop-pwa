import type { Block } from '@plentymarkets/shop-api';

export interface FlatBlock {
  uuid: string;
  label: string;
  depth: number;
  block: Block;
}

export interface TableOfContentsItemContentProps {
  uuid: string;
  blockName: string;
  label: string;
  isSelected: boolean;
  block: Block;
  isRoot: boolean;
}

export interface TableOfContentsItemProps {
  item: FlatBlock;
}

export interface InsertBlockLineProps {
  block: Block;
  isTop?: boolean;
}
