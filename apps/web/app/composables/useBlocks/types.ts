import type { Block, CategoryTemplate } from '@plentymarkets/shop-api';
import type { FooterSwitchDefinition } from '~/components/blocks/Footer/types';

export interface UseBlocksState {
  data: Block[];
  cleanData: Block[];
  defaultTemplateData: Block[];
  loading: boolean;
}

export interface UseBlocks {
  data: Ref<Block[]>;
  cleanData: Readonly<Ref<Block[]>>;
  blocks: Readonly<Ref<Block[]>>;
  renderableBlocks: Readonly<Ref<Block[]>>;
  headerContainer: Readonly<Ref<Block | null>>;
  footer: Readonly<Ref<Block | null>>;
  loading: Readonly<Ref<boolean>>;
  defaultTemplateData: Readonly<Ref<Block[]>>;
  fetchBlocks: (identifier: string | number, type: string) => Promise<void>;
  saveBlocks: (identifier: string | number, type: string, content: string) => Promise<boolean>;
  setupBlocks: (rawBlocks: Block[], type?: string) => void;
  updateBlocks: (blocks: Block[]) => void;
  setDefaultTemplate: (blocks: Block[]) => void;
  FOOTER_SWITCH_DEFINITIONS: FooterSwitchDefinition[];
}

export type UseBlocksReturn = () => UseBlocks;
