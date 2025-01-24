import type {
  UseSiteConfigurationReturn,
  UseSiteConfigurationState,
  LoadGoogleFont,
  SetDrawerView,
} from '~/composables/useSiteConfiguration/types';

/**
 * @description Composable for managing site configuration.
 * @returns UseSiteConfigurationReturn
 * @example
 * ``` ts
 * const { data, drawerOpen, loading, currentFont, drawerView } = UseSiteConfiguration();
 * ```
 */
export const useSiteConfiguration: UseSiteConfigurationReturn = () => {
  const state = useState<UseSiteConfigurationState>('siteConfiguration', () => ({
    data: [],
    drawerOpen: false,
    loading: false,
    currentFont: useRuntimeConfig().public.font,
    drawerView: 'settings',
  }));

  /**
   * @description Function for loading a google font.
   * @return LoadGoogleFont
   * @example
   * ``` ts
   * loadGoogleFont('Jersey 10');
   * ```
   */
  const loadGoogleFont: LoadGoogleFont = (fontName: string) => {
    const link = document.createElement('link');

    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;700&display=swap`;
    link.rel = 'stylesheet';

    document.head.appendChild(link);

    state.value.currentFont = `font-family: '${fontName}'`;
  };

  const setDrawerView: SetDrawerView = (blocks: string) => {
    state.value.drawerView = blocks as DrawerView;
  };

  const openDrawer = () => {
    state.value.drawerOpen = true;
  };

  const toggleDrawer = () => {
    state.value.drawerOpen = !state.value.drawerOpen;
  };

  return {
    ...toRefs(state.value),
    loadGoogleFont,
    setDrawerView,
    openDrawer,
    toggleDrawer,
  };
};
