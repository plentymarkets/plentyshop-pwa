import type { Component } from 'vue';
import type { Block } from '@plentymarkets/shop-api';
import type { BlockListCategory } from '~/composables/useBlocksList/types';

export type BlockLayoutResolvedRule = {
  container: boolean;
  padding: boolean;
  defaultFullWidth: boolean;
};

export type BlockLoader = () => Promise<Component>;

export interface BlockMoveEvent {
  draggedContext: { element: Block; index: number; futureIndex: number };
  relatedContext: { element: Block; index: number; list: Block[] };
}

export type DefaultsModule = {
  BlocksList?: () => Block[];
  createDefault?: () => Block;
};
