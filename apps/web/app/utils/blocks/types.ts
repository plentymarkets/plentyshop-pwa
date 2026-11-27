import type { Component } from 'vue';
import type { Block } from '@plentymarkets/shop-api';
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
  getBlocksList?: () => BlocksList;
  createDefault?: () => Block;
};

export interface PageTemplateEnvelope {
  kind: string;
  version: number;
  blocks: Block[];
}

export type BlockCompatibilityStatus = 'compatible' | 'partial' | 'incompatible';

export interface BlockCompatibility {
  name: string;
  status: BlockCompatibilityStatus;
  /** Names of this block (when incompatible) or of its nested blocks that cannot be used on the page. */
  skipped: string[];
}

export interface FilteredPageBlocks {
  blocks: Block[];
  /** One entry per top-level input block, in input order. */
  entries: BlockCompatibility[];
}
