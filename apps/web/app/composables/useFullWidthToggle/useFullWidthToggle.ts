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
type Layout = { fullWidth?: boolean };
type ConfigurationWithLayout = { layout?: Layout };

export const useFullWidthToggle = (
  layout: Ref<Layout> | ComputedRef<Layout>,
  defaultValue = false,
): UseFullWidthToggleReturn => {
  const isFullWidth = computed({
    get: () => layout.value.fullWidth ?? defaultValue,
    set: (value: boolean) => {
      layout.value.fullWidth = value;
    },
  });

  return { isFullWidth };
};

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
