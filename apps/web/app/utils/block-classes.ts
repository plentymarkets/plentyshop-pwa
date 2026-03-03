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
  const isRootNonFooter = getBlockDepth(block.meta.uuid) === 0 && block.name !== 'Footer';

  const horizontalClass = getHorizontalClass(!fullWidth && !isContainerExcluded ? horizontalSpacing : undefined);
  const verticalClass = getVerticalClass(verticalSpacing);

  return {
    [horizontalClass]: !fullWidth && !isContainerExcluded,
    [verticalClass]: block.name !== 'MultiGrid' && isRootNonFooter,
    'mx-auto': !isContainerExcluded,
    'p-4 md:px-6 lg:px-10': !isPaddingExcluded && !fullWidth && !isContainerExcluded,
  };
};
