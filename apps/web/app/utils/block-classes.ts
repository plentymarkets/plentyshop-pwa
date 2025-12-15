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
  },
): Record<string, boolean> => {
  const { fullWidth, rule, horizontalSpacing } = opts;
  const isContainerExcluded = rule.container === false;
  const isPaddingExcluded = rule.padding === false;

  const horizontalClass =
    !fullWidth && !isContainerExcluded ? getHorizontalClass(horizontalSpacing) : getHorizontalClass(undefined);

  return {
    [horizontalClass]: !fullWidth && !isContainerExcluded,
    'mx-auto': !isContainerExcluded,
    'md:px-6 lg:px-10 p-4': !isPaddingExcluded && !fullWidth && !isContainerExcluded,
  };
};
