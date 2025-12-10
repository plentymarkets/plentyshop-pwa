import type { UseFullWidthToggleReturn, Layout } from './types';

/**
 * Composable to manage the full-width toggle state for blocks with a direct `layout` property.
 *
 * @param content -A Ref to any object that may have a `layout` property at the root.
 * @param defaultValue - The default value to use if `fullWidth` is undefined (default: false).
 * @returns An object with a reactive `isFullWidth` property for two-way binding.
 */
export const useFullWidthToggleForContent = <Type extends { layout?: Layout }>(
  content: Ref<Type>,
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

const DEFAULT_LAYOUT: Layout = { fullWidth: false };

export const useFullWidthToggleForConfig = <Type extends { layout?: Layout }>(
  configuration: Ref<Type>,
  defaultLayout: Layout = DEFAULT_LAYOUT,
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
