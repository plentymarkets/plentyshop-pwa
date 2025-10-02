import type { UseDefaultMarginsOptions } from '~/composables/useDefaultMargins/types';

export const useDefaultMargins = (options: UseDefaultMarginsOptions) => {
  const DEFAULT_MARGIN = options.defaultMargin ?? 40;

  const defaultMarginLeft = computed(() => (options.blockDepth > 0 ? 0 : DEFAULT_MARGIN));
  const defaultMarginRight = computed(() => (options.blockDepth > 0 ? 0 : DEFAULT_MARGIN));

  return {
    defaultMarginLeft,
    defaultMarginRight,
  };
};
