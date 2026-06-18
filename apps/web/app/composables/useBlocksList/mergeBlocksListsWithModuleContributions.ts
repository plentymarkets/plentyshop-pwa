import type { BlocksList } from './types';
import { blocksListContributions } from '~/utils/blocks/block-contributions';

/**
 * Merges module-contributed block list categories into the base list.
 * For existing categories, variations are appended; new categories are added as-is.
 *
 * Contributions are discovered centrally in
 * `~/utils/blocks/block-contributions.ts` and cover both internal and external modules.
 */
export const mergeBlocksListsWithModuleContributions = (baseBlocksLists: BlocksList): BlocksList => {
  const merged = deepClone(baseBlocksLists);

  for (const contribution of blocksListContributions) {
    for (const [key, category] of Object.entries(contribution)) {
      if (!category) continue;

      const existing = merged[key];
      if (existing) {
        existing.variations = [...existing.variations, ...deepClone(category.variations ?? [])];
      } else {
        merged[key] = deepClone(category);
      }
    }
  }

  return merged;
};
