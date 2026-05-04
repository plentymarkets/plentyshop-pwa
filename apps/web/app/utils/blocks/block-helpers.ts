import type { Block, GetBlocksResponse } from '@plentymarkets/shop-api';

const HEADER_BLOCK_NAME = 'Header';

export const isHeaderBlock = (block: Block | null | undefined): boolean => block?.name === HEADER_BLOCK_NAME;
export const isGlobalBlock = (block: Block | null | undefined): boolean =>
  isFooterContainerBlock(block) || isHeaderContainerBlock(block);

const isBlockEmpty = (block: Block | null | undefined): boolean => {
  if (!block) return true;
  return !Array.isArray(block.content) || block.content.length === 0;
};

const getDefaultPageBlocks = (type: string, identifier: string | number): Block[] => {
  switch (type) {
    case 'immutable':
      return createHomepage();
    case 'category':
      if (typeof identifier === 'number' && identifier > 0) {
        return [];
      }
      return createCategory();
    case 'product':
      return createProduct();
    default:
      return [];
  }
};

export const assembleBlocks = (
  raw: GetBlocksResponse,
  type: string,
  identifier: string | number,
): GetBlocksResponse => {
  const HeaderContainer = isBlockEmpty(raw?.HeaderContainer)
    ? createDefaultHeaderContainerBlock()
    : raw?.HeaderContainer;

  const Footer = isBlockEmpty(raw?.Footer) ? createFooterContainer() : raw?.Footer;

  const pageBlocks =
    Array.isArray(raw?.blocks) && raw?.blocks.length > 0 ? raw?.blocks : getDefaultPageBlocks(type, identifier);

  migrateAllBlocks(pageBlocks);

  return { HeaderContainer, blocks: pageBlocks, Footer } as GetBlocksResponse;
};
