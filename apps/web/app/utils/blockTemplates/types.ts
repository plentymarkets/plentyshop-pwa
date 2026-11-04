import type { Block } from '@plentymarkets/shop-api';
import type { HeaderContainerBlock } from '~/components/blocks/structure/HeaderContainer/types';
import type { FooterContainerBlock } from '~/components/blocks/structure/FooterContainer/types';

/** Default-block factories a module can override via `runtime/utils/blockTemplates/<kind>.ts`. */
export interface BlockTemplateFactories {
  homepage: () => Block[];
  category: () => Block[];
  product: () => Block[];
  header: () => HeaderContainerBlock;
  footer: () => FooterContainerBlock;
}

export type BlockTemplateKind = keyof BlockTemplateFactories;

/** Shape of an override file: the factory must be the default export. */
export type BlockTemplateOverrideModule = {
  default?: BlockTemplateFactories[BlockTemplateKind];
};

export type BlockTemplateOverrides = Partial<BlockTemplateFactories>;
