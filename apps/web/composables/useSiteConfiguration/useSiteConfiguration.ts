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
    headerLogo: useRuntimeConfig().public.headerLogo,
    favicon: useRuntimeConfig().public.favicon,
    ogTitle: useRuntimeConfig().public.ogTitle,
    ogImg: useRuntimeConfig().public.ogImg,
    useAvif: useRuntimeConfig().public.useAvif,
    useWebp: useRuntimeConfig().public.useWebp,
    manufactured: useRuntimeConfig().public.manufactured,
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
      headerLogo: useRuntimeConfig().public.headerLogo,
      favicon: useRuntimeConfig().public.favicon,
      ogTitle: useRuntimeConfig().public.ogTitle,
      ogImg: useRuntimeConfig().public.ogImg,
      useAvif: useRuntimeConfig().public.useAvif,
      useWebp: useRuntimeConfig().public.useWebp,
      manufactured: useRuntimeConfig().public.manufactured,
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
      state.value.headerLogo !== state.value.initialData.headerLogo ||
      state.value.favicon !== state.value.initialData.favicon ||
      state.value.ogTitle !== state.value.initialData.ogTitle ||
      state.value.ogImg !== state.value.initialData.ogImg ||
      state.value.useAvif !== state.value.initialData.useAvif ||
      state.value.useWebp !== state.value.initialData.useWebp ||
      state.value.manufactured !== state.value.initialData.manufactured ||
      JSON.stringify(state.value.selectedFont) !== JSON.stringify(state.value.initialData.selectedFont)
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
      key: 'manufactured',
      value: state.value.manufactured,
      },
    ];
    const { error } = await useAsyncData(() => useSdk().plentysystems.setConfiguration({ settings }));

    if (error.value) {
      state.value.loading = false;
      return false;
    }

    state.value.initialData = {
      blockSize: state.value.blockSize,
      selectedFont: { caption: state.value.selectedFont.value, value: state.value.selectedFont.value },
      primaryColor: state.value.primaryColor,
      secondaryColor: state.value.secondaryColor,
      headerLogo: state.value.headerLogo,
      favicon: state.value.favicon,
      ogTitle: state.value.ogTitle,
      ogImg: state.value.ogImg,
      useAvif: state.value.useAvif,
      useWebp: state.value.useWebp,
      manufactured: state.value.manufactured,
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
