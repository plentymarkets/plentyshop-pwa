import type {
  UseSiteConfigurationReturn,
  UseSiteConfigurationState,
  LoadGoogleFont,
  SetTailwindColorProperties,
  SetColorPalette,
  DrawerView,
  SaveSettings,
} from '~/composables/useSiteConfiguration/types';
import type { TailwindPalette } from '~/utils/tailwindHelper';
import { getPaletteFromColor } from '~/utils/tailwindHelper';

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
    loading: false,
    currentFont: useRuntimeConfig().public.font,
    primaryColor: useRuntimeConfig().public.primaryColor,
    secondaryColor: useRuntimeConfig().public.secondaryColor,
    drawerView: 'settings',
    blockSize: useRuntimeConfig().public.blockSize,
    selectedFont: { caption: useRuntimeConfig().public.font, value: useRuntimeConfig().public.font },
    initialData: {
      blockSize: useRuntimeConfig().public.blockSize,
      selectedFont: { caption: useRuntimeConfig().public.font, value: useRuntimeConfig().public.font },
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

  const openDrawerWithView = (view: DrawerView) => {
    console.log('blockSize: ', useRuntimeConfig().public.blockSize)
    state.value.drawerView = view;
    state.value.drawerOpen = true;
  };

  const closeDrawer = () => {
    state.value.drawerOpen = false;
  };

  const updateBlockSize: UpdateBlockSize = (size: string) => {
    state.value.blockSize = size;
  };

  const settingsIsDirty = computed(() => {
    return (
      state.value.blockSize !== state.value.initialData.blockSize ||
      JSON.stringify(state.value.selectedFont) !== JSON.stringify(state.value.initialData.selectedFont)
    );
  });

  const saveSettings: SaveSettings = async () => {
    if (!settingsIsDirty.value) {
      return;
    }

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
        key: 'primary',
        value: '',
      },
      {
        key: 'secondary',
        value: '',
      }
    ];

    const { data, error } = await useAsyncData(() => useSdk().plentysystems.setConfiguration({ settings }));
  }

  return {
    updatePrimaryColor,
    updateSecondaryColor,
    ...toRefs(state.value),
    loadGoogleFont,
    updateBlockSize,
    openDrawerWithView,
    closeDrawer,
    settingsIsDirty,
    saveSettings,
  };
};
