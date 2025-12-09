import type { UseFullWidthToggleReturn } from './types';

type Layout = { fullWidth?: boolean };

/**
 * Composable to manage the full-width toggle state for blocks with a direct `layout` property.
 *
 * @param content -A Ref to any object that may have a `layout` property at the root.
 * @param defaultValue - The default value to use if `fullWidth` is undefined (default: false).
 * @returns An object with a reactive `isFullWidth` property for two-way binding.
 */
export const useFullWidthToggleForContent = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: Ref<any>,
  defaultValue = false,
): UseFullWidthToggleReturn => {
  const isFullWidth = computed({
    get: () => content.value?.layout?.fullWidth ?? defaultValue,
    set: (value: boolean) => {
      if (!content.value.layout) {
        content.value.layout = {};
      }
      content.value.layout.fullWidth = value;
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
  configuration: Ref<any>,
  defaultLayout: Layout = { fullWidth: false },
): UseFullWidthToggleReturn => {
  const isFullWidth = computed({
    get: () => configuration.value?.layout?.fullWidth ?? defaultLayout.fullWidth ?? false,
    set: (value: boolean) => {
      if (!configuration.value.layout) {
        configuration.value.layout = { ...defaultLayout };
      }
      configuration.value.layout.fullWidth = value;
    },
  });

  return { isFullWidth };
};
