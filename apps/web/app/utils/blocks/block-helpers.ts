import type { Block, GetBlocksResponse } from '@plentymarkets/shop-api';
import { migrateLegacyFooterToContainer } from '~/utils/blockTemplates/footer';
import { HEADER_BLOCK_NAME, NAVIGATION_BLOCK_NAME, UTILITY_BAR_BLOCK_NAME } from '~/utils/blocks/block-names';

export const isHeaderBlock = (block: Block | null | undefined): boolean => block?.name === HEADER_BLOCK_NAME;

export const isValidHeaderOrder = (blocks: Block[]): boolean => {
  const utilityBarIdx = blocks.findIndex((block) => block.name === UTILITY_BAR_BLOCK_NAME);
  const navigationIdx = blocks.findIndex(
    (block) => block.name === NAVIGATION_BLOCK_NAME || block.name === HEADER_BLOCK_NAME,
  );
  if (utilityBarIdx === -1 || navigationIdx === -1) {
    return true;
  }
  return navigationIdx > utilityBarIdx;
};

export const canMoveHeaderBlock = (currentBlocks: Block[], evt: BlockMoveEvent): boolean => {
  const from = evt.draggedContext.index;
  const to = evt.draggedContext.futureIndex;

  if (typeof from !== 'number' || typeof to !== 'number') {
    return true;
  }

  const proposed = [...currentBlocks];
  const [moved] = proposed.splice(from, 1);
  if (!moved) {
    return true;
  }
  proposed.splice(to, 0, moved);
  return isValidHeaderOrder(proposed);
};
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

const resolveFooter = (raw: GetBlocksResponse): Block => {
  const rawFooterContainer = raw?.FooterContainer as Block | undefined;
  if (rawFooterContainer && !isBlockEmpty(rawFooterContainer)) return rawFooterContainer;
  if (isLegacyFooterBlock(raw?.Footer) && raw.Footer) return migrateLegacyFooterToContainer(raw.Footer);
  if (!raw.Footer || isBlockEmpty(raw.Footer)) return createFooterContainer();
  return raw.Footer;
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

export const removeBlockFromColumn = (parent: Block, targetUuid: string): boolean => {
  if (!Array.isArray(parent.content)) {
    return false;
  }

  const content = parent.content as Block[];
  const idx = content.findIndex((block) => block.meta.uuid === targetUuid);
  if (idx === -1) {
    return false;
  }

  const removed = content[idx];
  if (!removed) {
    return false;
  }

  content.splice(idx, 1);

  const cfg = parent.configuration as
    | { columnWidths?: number[]; columnWidthsTablet?: number[]; columnWidthsMobile?: number[] }
    | undefined;

  if (cfg && Array.isArray(cfg.columnWidths)) {
    const slot = removed.parent_slot ?? 0;
    cfg.columnWidths.splice(slot, 1);

    if (cfg.columnWidthsTablet) {
      cfg.columnWidthsTablet.splice(slot, 1);
    }

    if (cfg.columnWidthsMobile) {
      cfg.columnWidthsMobile.splice(slot, 1);
    }

    content.forEach((b) => {
      if ((b.parent_slot ?? 0) > slot) b.parent_slot = (b.parent_slot ?? 0) - 1;
    });
  }
  return true;
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
