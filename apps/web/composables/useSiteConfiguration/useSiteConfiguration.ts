import type {
  UseSiteConfigurationReturn,
  UseSiteConfigurationState,
  LoadGoogleFont,
  DrawerView,
  SettingsType,
  SetActiveSetting,
} from '~/composables/useSiteConfiguration/types';
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
    drawerView: null,
    activeSetting: '',
    activeSubCategory: '',
    blockType: '',
    blockUuid: '',
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
    state.value.activeSetting = '';

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

  const togglePageModal = (value: boolean) => {
    state.value.pageModalOpen = value;
  };

  const setSettingsCategory = (category: CategoryTreeItem | null, settingsType?: SettingsType) => {
    state.value.settingsType = settingsType || null;
    state.value.settingsCategory = category;
  };

  const setActiveSubCategory = (subCategory: string) => {
    state.value.activeSubCategory = subCategory;
  };

  const setActiveSetting: SetActiveSetting = (setting: string) => {
    state.value.activeSubCategory = '';
    state.value.activeSetting = setting;
    state.value.drawerOpen = true;
    state.value.placement = 'left';
    state.value.drawerView = null;
  };

  const setImageActiveSetting = (setting: string) => {
    state.value.activeSetting = setting;
  };

  const { placeholderImg } = usePickerHelper();

  const updateHeaderLogo = () => {
    state.value.headerLogo = placeholderImg;
  };

  const updateFavicon = () => {
    state.value.favicon = placeholderImg;
  };

  const handleImageAdd = ({ image }: { image: string; name: string }) => {
    if (state.value.activeSetting === 'Logo') {
      state.value.headerLogo = image;
    } else if (state.value.activeSetting === 'Favicon') {
      state.value.favicon = image;
    }
  };

  return {
    ...toRefs(state.value),
    updateNewBlockPosition,
    loadGoogleFont,
    openDrawerWithView,
    closeDrawer,
    togglePageModal,
    setSettingsCategory,
    setActiveSubCategory,
    setActiveSetting,
    setImageActiveSetting,
    updateHeaderLogo,
    updateFavicon,
    handleImageAdd,
  };
};
