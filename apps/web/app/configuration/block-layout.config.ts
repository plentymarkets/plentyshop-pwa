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

  MultiGrid: { defaultFullWidth: false, padding: true },
  NewsletterSubscribe: { defaultFullWidth: false, padding: true },
  TextCard: { defaultFullWidth: false, padding: true },
  CategoryData: { defaultFullWidth: false, padding: true },
  CategorySorting: { defaultFullWidth: false, padding: true },
  BlockSort: { defaultFullWidth: false, padding: true },
  ProductRecommendedProducts: { defaultFullWidth: false, padding: true },
  ProductGrid: { defaultFullWidth: false, padding: true },
  Image: { defaultFullWidth: false, padding: true },
  ItemGrid: { defaultFullWidth: false, padding: true },
  ItemPage: { defaultFullWidth: false, padding: true },
  PriceCard: { defaultFullWidth: false, padding: true },
  ItemText: { defaultFullWidth: false, padding: true },
  TechnicalData: { defaultFullWidth: false, padding: true },
  CustomerReview: { defaultFullWidth: false, padding: true },
  ProductLegalInformation: { defaultFullWidth: false, padding: true },
  PerPageFilter: { defaultFullWidth: false, padding: true },
  Sort: { defaultFullWidth: false, padding: true },
  SortFilter: { defaultFullWidth: false, padding: true },

  Carousel: { padding: false },
};

/**
 * Resolve the normalized rule for a block name with defaults applied.
 */
export const resolveBlockLayoutRule = (
  name: string,
): Required<Pick<BlockLayoutRule, 'container' | 'padding' | 'defaultFullWidth'>> => {
  const rule = BLOCK_LAYOUT_RULES[name] || {};
  return {
    container: rule.container ?? true,
    padding: rule.padding ?? true,
    defaultFullWidth: rule.defaultFullWidth ?? true,
  };
};
