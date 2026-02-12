import type { Block } from '@plentymarkets/shop-api';
import type { MaybeRefOrGetter } from 'vue';

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
  blocks: MaybeRefOrGetter<Block[]>;
  hasEnabledActions?: boolean;
};
