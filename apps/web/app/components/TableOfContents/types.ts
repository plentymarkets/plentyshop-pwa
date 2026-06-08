import type { Block } from '@plentymarkets/shop-api';

export type TocSectionId = 'header' | 'content' | 'footer';

export interface TocSection {
  id: TocSectionId;
  label: string;
  elements: Block[];
  container?: Block;
  addTestId: string;
  setOrder: (next: Block[]) => void;
  canMove?: (evt: BlockMoveEvent) => boolean;
}

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
