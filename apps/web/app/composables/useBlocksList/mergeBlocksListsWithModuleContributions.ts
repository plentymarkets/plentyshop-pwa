import type { BlocksList, BlocksListContribution } from './types';

const moduleContributions = import.meta.glob<{ default?: BlocksListContribution }>(
  '~~/modules/*/runtime/components/blocks/**/blocks-list.json',
  { eager: true },
);

const sortedContributions = Object.entries(moduleContributions)
  .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
  .map(([, module]) => module.default)
  .filter((contribution): contribution is BlocksListContribution => Boolean(contribution));

/**
 * Merges module-contributed block list categories into the base list.
 * For existing categories, variations are appended; new categories are added as-is.
 */
export const mergeBlocksListsWithModuleContributions = (baseBlocksLists: BlocksList): BlocksList => {
  const merged = deepClone(baseBlocksLists);

  for (const contribution of sortedContributions) {
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
