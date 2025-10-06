const MAX_SAFE_MARGIN = 1000;

export const useDefaultMargins = (options: UseDefaultMarginsOptions) => {
  const DEFAULT_MARGIN = options.defaultMargin ?? 40;

  const defaultMarginLeft = computed(() => (options.blockDepth > 0 ? 0 : DEFAULT_MARGIN));
  const defaultMarginRight = computed(() => (options.blockDepth > 0 ? 0 : DEFAULT_MARGIN));

  const shouldHideOverflow = (layout: { marginLeft?: number; marginRight?: number } = {}) => {
    return Math.abs(layout.marginLeft || 0) > MAX_SAFE_MARGIN || Math.abs(layout.marginRight || 0) > MAX_SAFE_MARGIN;
  };

  return {
    defaultMarginLeft,
    defaultMarginRight,
    shouldHideOverflow,
  };
};
