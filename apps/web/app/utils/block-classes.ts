import type { Block } from '@plentymarkets/shop-api';

export type BlockLayoutResolvedRule = {
  container: boolean;
  padding: boolean;
  defaultFullWidth: boolean;
};

/**
 * Computes CSS classes for a Plenty block using resolved layout rules and a horizontal spacing key.
 * Pure function: does not depend on Vue.
 */
export const buildBlockClasses = (
  block: Block,
  opts: {
    fullWidth: boolean;
    rule: BlockLayoutResolvedRule;
    horizontalSpacing: string | undefined;
    verticalSpacing?: string | undefined;
  },
): Record<string, boolean> => {
  const { getBlockDepth } = useBlockManager();
  const { fullWidth, rule, horizontalSpacing, verticalSpacing } = opts;
  const isContainerExcluded = rule.container === false;
  const isPaddingExcluded = rule.padding === false;
  const depth = getBlockDepth(block.meta.uuid);
  // depth === -1 means the block wasn't found in the page tree (e.g. global blocks like Header
  // that live outside the page block hierarchy). Treat these the same as root-level blocks.
  const isRootNonFooter = (depth === 0 || depth === -1) && block.name !== 'Footer';

  const horizontalClass = getHorizontalClass(!fullWidth && !isContainerExcluded ? horizontalSpacing : undefined);
  const verticalClass = getVerticalClass(verticalSpacing);
  const shouldApplyVerticalSpacing = block.name !== 'MultiGrid' && block.name !== 'HeaderContainer' && isRootNonFooter;

  return {
    [horizontalClass]: !fullWidth && !isContainerExcluded,
    [verticalClass]: shouldApplyVerticalSpacing,
    'mx-auto': !isContainerExcluded,
    'p-4 md:px-6 lg:px-10': !isPaddingExcluded && !fullWidth && !isContainerExcluded,
  };
};
