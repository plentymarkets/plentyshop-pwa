import type { Block } from '@plentymarkets/shop-api';

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

export type BlockArea = 'header' | 'main' | 'footer' | 'all';

export type EditablePageProps = {
  identifier: string | number;
  type: string;
  area?: BlockArea;
  hasEnabledActions?: boolean;
  preventBlocksRequest?: boolean;
};
