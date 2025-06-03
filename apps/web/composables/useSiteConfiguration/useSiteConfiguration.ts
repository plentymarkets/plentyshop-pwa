import type {
  UseSiteConfigurationReturn,
  UseSiteConfigurationState,
  LoadGoogleFont,
  SetTailwindColorProperties,
  SetColorPalette,
  DrawerView,
  SaveSettings,
  SettingsType,
} from '~/composables/useSiteConfiguration/types';
import type { TailwindPalette } from '~/utils/tailwindHelper';
import { getPaletteFromColor } from '~/utils/tailwindHelper';
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
    primaryColor: useRuntimeConfig().public.primaryColor,
    secondaryColor: useRuntimeConfig().public.secondaryColor,
    iconColor: useRuntimeConfig().public.iconColor,
    headerBackgroundColor: useRuntimeConfig().public.headerBackgroundColor,
    headerLogo: useRuntimeConfig().public.headerLogo,
    favicon: structuredClone(favicon).icon,
    ogTitle: structuredClone(openGraph).title,
    ogImg: structuredClone(openGraph).image,
    useAvif: useRuntimeConfig().public.useAvif,
    useWebp: useRuntimeConfig().public.useWebp,
    seoSettings: metaDefaults,
    drawerView: null,
    blockType: '',
    blockUuid: '',
    blockSize: useRuntimeConfig().public.blockSize,
    selectedFont: { caption: useRuntimeConfig().public.font, value: useRuntimeConfig().public.font },
    initialData: {
      blockSize: useRuntimeConfig().public.blockSize,
      selectedFont: { caption: useRuntimeConfig().public.font, value: useRuntimeConfig().public.font },
      primaryColor: useRuntimeConfig().public.primaryColor,
      secondaryColor: useRuntimeConfig().public.secondaryColor,
      iconColor: useRuntimeConfig().public.iconColor,
      headerBackgroundColor: useRuntimeConfig().public.headerBackgroundColor,
      seoSettings: structuredClone(metaDefaults),
      headerLogo: useRuntimeConfig().public.headerLogo,
      favicon: structuredClone(favicon).icon,
      ogTitle: structuredClone(openGraph).title,
      ogImg: structuredClone(openGraph).image,
      useAvif: useRuntimeConfig().public.useAvif,
      useWebp: useRuntimeConfig().public.useWebp,
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

  const setColorProperties: SetTailwindColorProperties = (type: string, tailwindPalette: TailwindPalette) => {
    tailwindPalette.forEach((shade) => {
      if (shade.rgb) {
        document.documentElement.style.setProperty(`--colors-2-${type}-${shade.weight}`, shade.rgb);
      }
    });
  };

  const updatePrimaryColor: SetColorPalette = (hexColor: string) => {
    const tailwindColors: TailwindPalette = getPaletteFromColor('primary', hexColor).map((color) => ({
      ...color,
    }));

    setColorProperties('primary', tailwindColors);
  };

  const updateSecondaryColor: SetColorPalette = (hexColor: string) => {
    const tailwindColors: TailwindPalette = getPaletteFromColor('secondary', hexColor).map((color) => ({
      ...color,
    }));

    setColorProperties('secondary', tailwindColors);
  };

  const updateHeaderBackgroundColor: SetColorPalette = (hexColor: string) => {
    const tailwindColors: TailwindPalette = getPaletteFromColor('header', hexColor).map((color) => ({
      ...color,
    }));

    setColorProperties('header', tailwindColors);
  };

  watch(
    () => state.value.primaryColor,
    (newValue) => {
      updatePrimaryColor(newValue);
    },
  );

  watch(
    () => state.value.secondaryColor,
    (newValue) => {
      updateSecondaryColor(newValue);
    },
  );

  watch(
    () => state.value.headerBackgroundColor,
    (newValue) => {
      updateHeaderBackgroundColor(newValue);
    },
  );

  const openDrawerWithView = (view: DrawerView, block?: Block) => {
    if (block) {
      state.value.blockType = block.name;
      state.value.blockUuid = block.meta.uuid;
    }

    state.value.drawerView = view;
    state.value.drawerOpen = true;

    state.value.placement = view === 'blocksSettings' ? 'right' : 'left';
  };

  const closeDrawer = () => {
    state.value.drawerOpen = false;
    state.value.drawerView = null;
  };

  const updateBlockSize: UpdateBlockSize = (size: string) => {
    state.value.blockSize = size;
  };

  const updateNewBlockPosition = (position: number) => {
    state.value.newBlockPosition = position;
  };

  const settingsIsDirty = computed(() => {
    return (
      state.value.blockSize !== state.value.initialData.blockSize ||
      state.value.primaryColor !== state.value.initialData.primaryColor ||
      state.value.secondaryColor !== state.value.initialData.secondaryColor ||
      state.value.iconColor !== state.value.initialData.iconColor ||
      state.value.headerBackgroundColor !== state.value.initialData.headerBackgroundColor ||
      state.value.headerLogo !== state.value.initialData.headerLogo ||
      state.value.favicon !== state.value.initialData.favicon ||
      state.value.ogTitle !== state.value.initialData.ogTitle ||
      state.value.ogImg !== state.value.initialData.ogImg ||
      state.value.useAvif !== state.value.initialData.useAvif ||
      state.value.useWebp !== state.value.initialData.useWebp ||
      JSON.stringify(state.value.selectedFont) !== JSON.stringify(state.value.initialData.selectedFont) ||
      JSON.stringify(state.value.selectedFont) !== JSON.stringify(state.value.initialData.selectedFont) ||
      JSON.stringify(state.value.seoSettings) !== JSON.stringify(state.value.initialData.seoSettings)
    );
  });

  const saveSettings: SaveSettings = async (): Promise<boolean> => {
    state.value.loading = true;

    const settings = [
      {
        key: 'blockSize',
        value: state.value.blockSize,
      },
      {
        key: 'font',
        value: state.value.selectedFont.value,
      },
      {
        key: 'primaryColor',
        value: state.value.primaryColor,
      },
      {
        key: 'secondaryColor',
        value: state.value.secondaryColor,
      },
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
      {
        key: 'iconColor',
        value: state.value.iconColor,
      },
      {
        key: 'headerBackgroundColor',
        value: state.value.headerBackgroundColor,
      },
    ];

    try {
      useSdk().plentysystems.setConfiguration({ settings });
    } catch {
      state.value.loading = false;
      return false;
    }

    state.value.initialData = {
      blockSize: state.value.blockSize,
      selectedFont: { caption: state.value.selectedFont.value, value: state.value.selectedFont.value },
      primaryColor: state.value.primaryColor,
      secondaryColor: state.value.secondaryColor,
      iconColor: state.value.iconColor,
      headerBackgroundColor: state.value.headerBackgroundColor,
      headerLogo: state.value.headerLogo,
      favicon: state.value.favicon,
      ogTitle: state.value.ogTitle,
      ogImg: state.value.ogImg,
      useAvif: state.value.useAvif,
      useWebp: state.value.useWebp,
      seoSettings: state.value.seoSettings,
    };

    state.value.loading = false;
    return true;
  };

  const togglePageModal = (value: boolean) => {
    state.value.pageModalOpen = value;
  };

  const setSettingsCategory = (category: CategoryTreeItem | null, settingsType?: SettingsType) => {
    state.value.settingsType = settingsType || null;
    state.value.settingsCategory = category;
  };

  return {
    updatePrimaryColor,
    updateSecondaryColor,
    updateHeaderBackgroundColor,
    ...toRefs(state.value),
    updateNewBlockPosition,
    loadGoogleFont,
    updateBlockSize,
    openDrawerWithView,
    closeDrawer,
    settingsIsDirty,
    saveSettings,
    togglePageModal,
    setSettingsCategory,
  };
};
