import type { Block } from '@plentymarkets/shop-api';

export type BlockLayout = { narrowContainer?: boolean };

export type BlockWithLayout = Block & {
  content?: { layout?: BlockLayout };
  layout?: BlockLayout;
};

export interface DragEvent<T = Block> {
  added?: {
    element: T;
    newIndex: number;
  };
  removed?: {
    element: T;
    oldIndex: number;
  };
  moved?: {
    element: T;
    oldIndex: number;
    newIndex: number;
  };
}

export type EditableBlocksProps = {
  identifier?: string | number;
  type?: string;
  isRoot?: boolean;
  hasEnabledActions?: boolean;
  preventBlocksRequest?: boolean;
  readOnly?: boolean;
  blocks?: Block[];
};
