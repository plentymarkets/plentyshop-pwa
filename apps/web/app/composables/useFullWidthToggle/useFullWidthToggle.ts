import type { UseFullWidthToggleReturn } from './types';

/**
 * Composable to manage the full-width toggle state for blocks with a direct `layout` property.
 *
 * @param layout - A Ref or ComputedRef containing the block's layout object (with optional `fullWidth` property).
 * @param defaultValue - The default value to use if `fullWidth` is undefined (default: false).
 * @returns An object with a reactive `isFullWidth` property for two-way binding.
 *
 * @example
 * ```ts
 * // For blocks with a direct layout property:
 * const block = ref({ layout: { fullWidth: true } });
 * const { isFullWidth } = useFullWidthToggle(computed(() => block.value.layout));
 * ```
 */
type Layout = { fullWidth?: boolean };
type ConfigurationWithLayout = { layout?: Layout };

export const useFullWidthToggle = (layout: Ref<Layout>, defaultValue = false): UseFullWidthToggleReturn => {
  const isFullWidth = computed({
    get: () => layout.value.fullWidth ?? defaultValue,
    set: (value: boolean) => {
      if (!layout.value) layout.value = {};
      layout.value.fullWidth = value;
    },
  });

  return { isFullWidth };
};

/**
 * Composable to manage the full-width toggle state for "structure" blocks
 * where the `layout` object is nested inside a `configuration` property.
 * Automatically initializes the `layout` object if it is missing.
 *
 * @param configuration - A Ref or ComputedRef containing the block's configuration object (with optional `layout` property).
 * @param defaultLayout - The default layout object to use if `layout` is missing (default: `{ fullWidth: false }`).
 * @returns An object with a reactive `isFullWidth` property for two-way binding.
 *
 * @example
 * ```ts
 * // For structure blocks with configuration.layout:
 * const block = ref({ configuration: { layout: { fullWidth: false } } });
 * const { isFullWidth } = useFullWidthToggleForConfig(computed(() => block.value.configuration));
 * ```
 */

export const useFullWidthToggleForConfig = (
  configuration: Ref<ConfigurationWithLayout> | ComputedRef<ConfigurationWithLayout>,
  defaultLayout: Layout = { fullWidth: false },
): UseFullWidthToggleReturn => {
  const isFullWidth = computed({
    get: () => configuration.value.layout?.fullWidth ?? defaultLayout.fullWidth ?? false,
    set: (value: boolean) => {
      if (!configuration.value.layout) {
        configuration.value.layout = { ...defaultLayout };
      }
      configuration.value.layout.fullWidth = value;
    },
  });

  return { isFullWidth };
};
