import type { Block } from '@plentymarkets/shop-api';
import type { BlocksList, BlocksListContext } from '~/composables/useBlocksList/types';
import type { BlockCompatibility, FilteredPageBlocks } from './types';
import { EMPTY_GRID_BLOCK_NAME } from './block-names';

/**
 * Maps each block name (taken from the variation templates, not the category's `blockName` grouping)
 * to the page contexts that may use it. A name offered by several categories is allowed if any of them allows it.
 */
export const getBlockAccessMap = (blocksLists: BlocksList): Map<string, BlocksListContext[]> => {
  const accessMap = new Map<string, BlocksListContext[]>();
  for (const category of Object.values(blocksLists)) {
    for (const variation of category.variations) {
      const name = variation.template?.en?.name;
      if (name) {
        accessMap.set(name, [...(accessMap.get(name) ?? []), ...(category.accessControl ?? [])]);
      }
    }
  }
  return accessMap;
};

/**
 * Removes blocks that cannot be rendered on the target page: blocks without a loader (unsupported) and blocks whose
 * category denies the page context. Nested blocks are checked too; a removed nested block is replaced with an empty
 * grid slot so the column layout stays intact. The nested `content` of the given blocks is modified in place, so pass
 * a copy. Also reports, per top-level block, whether it is fully, partly or not compatible.
 * Blocks that appear in no block list (e.g. structural blocks) are kept, as long as a loader exists.
 * An empty context means the page type is unknown, so access is not checked.
 */
export const filterBlocksForContext = (
  blocks: Block[],
  context: BlocksListContext,
  accessMap: Map<string, BlocksListContext[]>,
  isSupported: (name: string) => boolean,
): FilteredPageBlocks => {
  const isAllowed = (name: string) => {
    if (name === EMPTY_GRID_BLOCK_NAME) {
      return true;
    }
    if (!isSupported(name)) {
      return false;
    }
    const contexts = accessMap.get(name);
    return !context || !contexts || contexts.includes(context);
  };

  const filter = (list: Block[], isNested: boolean, skipped: Set<string>): Block[] =>
    list.flatMap((block) => {
      if (!isAllowed(block.name)) {
        skipped.add(block.name);
        return isNested && typeof block.parent_slot === 'number' ? [createEmptyGridBlock(block.parent_slot)] : [];
      }
      if (Array.isArray(block.content)) {
        block.content = filter(block.content as Block[], true, skipped);
      }
      return [block];
    });

  const entries: BlockCompatibility[] = [];
  const result = blocks.flatMap((block) => {
    const skipped = new Set<string>();
    const kept = filter([block], false, skipped);
    let status: BlockCompatibility['status'] = 'partial';
    if (!skipped.size) {
      status = 'compatible';
    } else if (!kept.length) {
      status = 'incompatible';
    }
    entries.push({ name: block.name, status, skipped: [...skipped] });
    return kept;
  });

  return { blocks: result, entries };
};
