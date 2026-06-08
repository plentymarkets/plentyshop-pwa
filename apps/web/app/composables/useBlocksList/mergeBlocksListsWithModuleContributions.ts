import type { BlocksList, BlockListCategory } from './types';

type BlocksListContribution = Partial<BlocksList>;

type BlocksListContributionModule = {
  default?: BlocksListContribution;
};

const moduleBlocksListContributionFiles = import.meta.glob<BlocksListContributionModule>(
  '~~/modules/*/runtime/components/blocks/**/blocks-list.json',
  { eager: true },
);

const appendVariations = (
  category: BlockListCategory,
  variationsToAppend: BlockListCategory['variations'] = [],
): BlockListCategory => ({
  ...category,
  variations: [...(category.variations ?? []), ...deepClone(variationsToAppend)],
});

const getRequiredKeys = (value: unknown): string[] =>
  typeof value === 'object' && value !== null ? Object.keys(value as Record<string, unknown>) : [];

const hasRequiredShape = (candidate: unknown, reference: unknown): boolean => {
  const requiredKeys = getRequiredKeys(reference);
  if (!requiredKeys.length) return true;
  if (typeof candidate !== 'object' || candidate === null) return false;

  const candidateRecord = candidate as Record<string, unknown>;
  return requiredKeys.every((key) => key in candidateRecord);
};

const hasRequiredCategoryShape = (
  category: BlockListCategory,
  referenceCategory: BlockListCategory,
): boolean => {
  if (!hasRequiredShape(category, referenceCategory)) return false;
  const referenceVariation = referenceCategory.variations?.[0];
  if (!referenceVariation) return true;

  return (category.variations ?? []).every((variation) => hasRequiredShape(variation, referenceVariation));
};

const findTargetCategoryKey = (
  merged: BlocksList,
  contributionKey: string,
  contributionCategory: BlockListCategory,
): string => {
  if (merged[contributionKey]) return contributionKey;

  const matchingByCategoryName = Object.entries(merged).find(
    ([, existingCategory]) => existingCategory.category === contributionCategory.category,
  );

  return matchingByCategoryName?.[0] ?? contributionKey;
};

export const mergeBlocksListsWithModuleContributions = (baseBlocksLists: BlocksList): BlocksList => {
  const firstDefaultCategory = Object.values(baseBlocksLists)[0];
  const sortedContributions = Object.entries(moduleBlocksListContributionFiles)
    .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
    .map(([, module]) => module.default)
    .filter(Boolean) as BlocksListContribution[];

  return sortedContributions.reduce<BlocksList>((acc, contribution) => {
    const merged = acc;

    // Module JSON must follow the same root structure as default blocksLists.json.
    for (const [contributionKey, contributionCategory] of Object.entries(contribution)) {
      if (!contributionCategory) continue;

      const targetCategoryKey = findTargetCategoryKey(merged, contributionKey, contributionCategory);
      const referenceCategory = merged[targetCategoryKey] ?? firstDefaultCategory;
      if (!referenceCategory || !hasRequiredCategoryShape(contributionCategory, referenceCategory)) continue;

      if (!merged[targetCategoryKey]) {
        merged[targetCategoryKey] = deepClone(contributionCategory);
        continue;
      }

      merged[targetCategoryKey] = appendVariations(merged[targetCategoryKey], contributionCategory.variations ?? []);
    }

    return merged;
  }, deepClone(baseBlocksLists));
};