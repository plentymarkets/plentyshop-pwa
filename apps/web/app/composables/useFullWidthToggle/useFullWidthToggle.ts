import type { UseFullWidthToggleReturn } from './types';

type Layout = { fullWidth?: boolean };

/**
 * Composable to manage the full-width toggle state for blocks with a direct `layout` property.
 *
 * @param block - A Ref containing the block object with optional `layout` property.
 * @param defaultValue - The default value to use if `fullWidth` is undefined (default: false).
 * @returns An object with a reactive `isFullWidth` property for two-way binding.
 */
export const useFullWidthToggleForContent = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  block: Ref<any>,
  defaultValue = false,
): UseFullWidthToggleReturn => {
  const isFullWidth = computed({
    get: () => block.value?.layout?.fullWidth ?? defaultValue,
    set: (value: boolean) => {
      if (!block.value.layout) {
        block.value.layout = {};
      }
      block.value.layout.fullWidth = value;
    },
  });

  return { isFullWidth };
};
/**
 * Composable to manage the full-width toggle state for "structure" blocks
 * where the `layout` object is nested inside a `configuration` property.
 *
 * @param configuration - A Ref containing the configuration object with optional `layout` property.
 * @param defaultLayout - The default layout object to use if `layout` is missing.
 * @returns An object with a reactive `isFullWidth` property for two-way binding.
 */

export const useFullWidthToggleForConfig = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  block: Ref<any>,
  defaultLayout: Layout = { fullWidth: false },
): UseFullWidthToggleReturn => {
  const isFullWidth = computed({
    get: () => block.value?.layout?.fullWidth ?? defaultLayout.fullWidth ?? false,
    set: (value: boolean) => {
      if (!block.value.layout) {
        block.value.layout = { ...defaultLayout };
      }
      block.value.layout.fullWidth = value;
    },
  });

  return { isFullWidth };
};
