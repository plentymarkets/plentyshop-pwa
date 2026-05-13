import type { Block, GetBlocksResponse } from '@plentymarkets/shop-api';
import { migrateLegacyFooterToContainer } from '~/utils/blockTemplates/footer';

const HEADER_BLOCK_NAME = 'Header';

export const isHeaderBlock = (block: Block | null | undefined): boolean => block?.name === HEADER_BLOCK_NAME;
export const isGlobalBlock = (block: Block | null | undefined): boolean =>
  isFooterContainerBlock(block) || isHeaderContainerBlock(block);

const isBlockEmpty = (block: Block | null | undefined): boolean => {
  if (!block) return true;
  return !Array.isArray(block.content) || block.content.length === 0;
};

const DEFAULT_PAGE_BLOCKS_MAP: Record<string, (identifier: string | number) => Block[]> = {
  immutable: () => createHomepage(),
  category: (identifier) => (typeof identifier === 'number' && identifier > 0 ? [] : createCategory()),
  product: () => createProduct(),
};

const getDefaultPageBlocks = (type: string, identifier: string | number): Block[] =>
  (DEFAULT_PAGE_BLOCKS_MAP[type] ?? (() => []))(identifier);

const resolveFooter = (raw: GetBlocksResponse): Block | undefined => {
  const rawFooterContainer = raw?.FooterContainer as Block | undefined;
  if (!isBlockEmpty(rawFooterContainer)) return rawFooterContainer;
  if (isLegacyFooterBlock(raw?.Footer) && raw.Footer) return migrateLegacyFooterToContainer(raw.Footer);
  if (isBlockEmpty(raw?.Footer)) return createFooterContainer();
  return raw?.Footer;
};

const resolvePageBlocks = (
  raw: GetBlocksResponse,
  type: string,
  identifier: string | number,
  hasSnapshot?: boolean,
): Block[] => {
  if (Array.isArray(raw?.blocks) && raw.blocks.length > 0) return raw.blocks;
  if (hasSnapshot) return [];
  return getDefaultPageBlocks(type, identifier);
};

export const assembleBlocks = (
  raw: GetBlocksResponse,
  type: string,
  identifier: string | number,
  hasSnapshot?: boolean,
): GetBlocksResponse => {
  const HeaderContainer = isBlockEmpty(raw?.HeaderContainer)
    ? createDefaultHeaderContainerBlock()
    : raw?.HeaderContainer;

  const Footer = resolveFooter(raw);
  const pageBlocks = resolvePageBlocks(raw, type, identifier, hasSnapshot);

  migrateAllBlocks(pageBlocks);

  return { HeaderContainer, blocks: pageBlocks, Footer };
};
