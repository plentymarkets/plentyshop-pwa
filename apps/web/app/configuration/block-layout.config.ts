/**
 * Centralized layout rules per block name.
 * This replaces scattered exclusion Sets with a single, declarative config.
 */

export type BlockLayoutRule = {
  /** Whether the block content should be constrained in a container (max-width + centering). Defaults to true. */
  container?: boolean;
  /** Whether the default horizontal padding should be applied. Defaults to true. */
  padding?: boolean;
  /** Default fullWidth behavior when block does not explicitly set layout.fullWidth. Defaults to true. */
  defaultFullWidth?: boolean;
};

/**
 * Rules keyed by Plenty block name.
 * Only specify exceptions; unspecified flags fall back to sensible defaults.
 */
export const BLOCK_LAYOUT_RULES: Record<string, BlockLayoutRule> = {
  Footer: { container: false, padding: false },

  MultiGrid: { defaultFullWidth: false, padding: false },
  NewsletterSubscribe: { defaultFullWidth: false, padding: false },
  TextCard: { defaultFullWidth: false, padding: false },
  CategoryData: { defaultFullWidth: false, padding: false },
  CategorySorting: { defaultFullWidth: false, padding: false },
  BlockSort: { defaultFullWidth: false, padding: false },
  ProductRecommendedProducts: { defaultFullWidth: false, padding: false },
  ProductGrid: { defaultFullWidth: false, padding: false },
  Image: { defaultFullWidth: false, padding: false },
  ItemGrid: { defaultFullWidth: false, padding: false },
  ItemPage: { defaultFullWidth: false, padding: false },
  PriceCard: { defaultFullWidth: false, padding: false },
  ItemText: { defaultFullWidth: false, padding: false },
  TechnicalData: { defaultFullWidth: false, padding: false },
  CustomerReview: { defaultFullWidth: false, padding: false },
  ProductLegalInformation: { defaultFullWidth: false, padding: false },
  PerPageFilter: { defaultFullWidth: false, padding: false },
  Sort: { defaultFullWidth: false, padding: false },
  SortFilter: { defaultFullWidth: false, padding: false },

  Carousel: { padding: false },
};

/**
 * Resolve the normalized rule for a block name with defaults applied.
 */
export const resolveBlockLayoutRule = (
  name: string
): Required<Pick<BlockLayoutRule, 'container' | 'padding' | 'defaultFullWidth'>> => {
  const rule = BLOCK_LAYOUT_RULES[name] || {};
  return {
    container: rule.container ?? true,
    padding: rule.padding ?? true,
    defaultFullWidth: rule.defaultFullWidth ?? true,
  };
};
