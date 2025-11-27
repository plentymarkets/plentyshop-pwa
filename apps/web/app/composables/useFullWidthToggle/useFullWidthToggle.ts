import type { UseFullWidthToggleReturn } from './types';

/**
 * Composable to manage full-width toggle state for blocks.
 * 
 * @param block - A computed or ref containing the block data with optional layout property
 * @returns Computed ref for two-way binding to FullWidthToggle component
 * 
 * @example
 * ```ts
 * const newsletterBlock = computed(() => findBlock(...));
 * const isFullWidth = useFullWidthToggle(newsletterBlock);
 * ```
 */
export const useFullWidthToggle = <T extends { layout?: { fullWidth?: boolean } }>(
  block: ComputedRef<T> | Ref<T>,
): UseFullWidthToggleReturn => {
  const isFullWidth = computed({
    get: () => block.value.layout?.fullWidth ?? false,
    set: (value: boolean) => {
      if (!block.value.layout) {
        block.value.layout = {};
      }
      block.value.layout.fullWidth = value;
    },
  });

  return { isFullWidth };
};