import type {
  UseSiteConfigurationReturn,
  UseSiteConfigurationState,
  LoadGoogleFont,
  DrawerView,
  SaveSettings,
  SettingsType,
  SetActiveSetting,
} from '~/composables/useSiteConfiguration/types';
import { metaDefaults, openGraph, favicon } from '~/configuration/app.config';
import type { Block, CategoryTreeItem } from '@plentymarkets/shop-api';

/**
 * @description Composable for managing site configuration.
 * @returns UseSiteConfigurationReturn
 * @example
 * ``` ts
 * const { data, drawerOpen, loading, currentFont, drawerView, settingsIsDirty, saveSettings } = UseSiteConfiguration();
 * ```
 */
export const useSiteConfiguration: UseSiteConfigurationReturn = () => {
  const state = useState<UseSiteConfigurationState>('siteConfiguration', () => ({
    data: [],
    drawerOpen: false,
    pageModalOpen: false,
    settingsCategory: null,
    settingsType: null,
    loading: false,
    placement: 'left',
    newBlockPosition: 0,
    currentFont: useRuntimeConfig().public.font,
    headerLogo: useRuntimeConfig().public.headerLogo,
    favicon: structuredClone(favicon).icon,
    ogTitle: structuredClone(openGraph).title,
    ogImg: structuredClone(openGraph).image,
    useAvif: useRuntimeConfig().public.useAvif,
    useWebp: useRuntimeConfig().public.useWebp,
    seoSettings: metaDefaults,
    drawerView: null,
    activeSetting: '',
    blockType: '',
    blockUuid: '',
    initialData: {
      seoSettings: structuredClone(metaDefaults),
      headerLogo: useRuntimeConfig().public.headerLogo,
      favicon: structuredClone(favicon).icon,
      ogTitle: structuredClone(openGraph).title,
      ogImg: structuredClone(openGraph).image,
      useAvif: useRuntimeConfig().public.useAvif,
      useWebp: useRuntimeConfig().public.useWebp
    },
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

  const openDrawerWithView = (view: DrawerView, block?: Block) => {
    if (block) {
      state.value.blockType = block.name;
      state.value.blockUuid = block.meta.uuid;
    }

    state.value.drawerView = view;
    state.value.drawerOpen = true;
    state.value.activeSetting = ''; // TODO: remove once all settings are moved to new structure

    state.value.placement = view === 'blocksSettings' ? 'right' : 'left';
  };

  const closeDrawer = () => {
    state.value.drawerOpen = false;
    state.value.drawerView = null;
    state.value.activeSetting = '';
  };

  const updateNewBlockPosition = (position: number) => {
    state.value.newBlockPosition = position;
  };

  const settingsIsDirty = computed(() => {
    const { isDirty } = useSiteSettings();

    return (
      state.value.headerLogo !== state.value.initialData.headerLogo ||
      state.value.favicon !== state.value.initialData.favicon ||
      state.value.ogTitle !== state.value.initialData.ogTitle ||
      state.value.ogImg !== state.value.initialData.ogImg ||
      state.value.useAvif !== state.value.initialData.useAvif ||
      state.value.useWebp !== state.value.initialData.useWebp ||
      JSON.stringify(state.value.seoSettings) !== JSON.stringify(state.value.initialData.seoSettings) ||
      isDirty.value
    );
  });

  const saveSettings: SaveSettings = async (): Promise<boolean> => {
    try {
      state.value.loading = true;

      const { data, saveSiteSettings } = useSiteSettings();

      const settings = [
        {
          key: 'headerLogo',
          value: state.value.headerLogo,
        },
        {
          key: 'favicon',
          value: state.value.favicon,
        },
        {
          key: 'ogTitle',
          value: state.value.ogTitle,
        },
        {
          key: 'ogImg',
          value: state.value.ogImg,
        },
        {
          key: 'useAvif',
          value: state.value.useAvif ? 'true' : 'false',
        },
        {
          key: 'useWebp',
          value: state.value.useWebp ? 'true' : 'false',
        },
        {
          key: 'metaTitle',
          value: state.value.seoSettings.title,
        },
        {
          key: 'metaDescription',
          value: state.value.seoSettings.description,
        },
        {
          key: 'metaKeywords',
          value: state.value.seoSettings.keywords,
        },
        {
          key: 'robots',
          value: state.value.seoSettings.robots,
        },
        ...Object.entries(data.value || {}).map(([key, val]) => ({
          key,
          value: String(val || ''),
        })),
      ];

      await useSdk().plentysystems.setConfiguration({ settings });

      state.value.initialData = {
        headerLogo: state.value.headerLogo,
        favicon: state.value.favicon,
        ogTitle: state.value.ogTitle,
        ogImg: state.value.ogImg,
        useAvif: state.value.useAvif,
        useWebp: state.value.useWebp,
        seoSettings: state.value.seoSettings
      };

      saveSiteSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      state.value.loading = false;
    }
    return true;
  };

  const togglePageModal = (value: boolean) => {
    state.value.pageModalOpen = value;
  };

  const setSettingsCategory = (category: CategoryTreeItem | null, settingsType?: SettingsType) => {
    state.value.settingsType = settingsType || null;
    state.value.settingsCategory = category;
  };

  const setActiveSetting: SetActiveSetting = (setting: string) => {
    state.value.activeSetting = setting;
    state.value.drawerOpen = true;
    state.value.placement = 'left';
    state.value.drawerView = null; // TODO: remove once all settings are moved to new structure
  };

  return {
    ...toRefs(state.value),
    updateNewBlockPosition,
    loadGoogleFont,
    openDrawerWithView,
    closeDrawer,
    settingsIsDirty,
    saveSettings,
    togglePageModal,
    setSettingsCategory,
    setActiveSetting,
  };
};
