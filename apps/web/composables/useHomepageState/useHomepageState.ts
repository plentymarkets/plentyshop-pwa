import { UseHomepageDataReturn, UseHomepageDataState, HomeData } from './types';
import { toRefs, ref, watch } from 'vue';
import { SizeKey } from '~/components/ui/HeroCarousel/types';
import { MediaItemProps } from '~/components/ui/MediaCard/types';
import homepageTemplateData from '~/composables/useHomepageData/homepageTemplateData.json';
import { HeroContentProps } from '~/components/ui/HeroCarousel/types';

/**
 * @description Composable managing homepage data
 * @returns UseHomepageDataReturn
 * @example
 * ``` ts
 * const { data, loading, fetchData } = useHomePageState('');
 * ```
 */

const homepageTemplate = ref(homepageTemplateData);
const runtimeConfig = useRuntimeConfig();
const { isEditingDisabled } = useEditor();

/**
 * @description Fetches the homepage template data for a given category ID
 * @param homepageCategoryId The ID of the homepage category to fetch the template for
 */
const isEmptyObject = (obj: any) => {
  return Object.keys(obj).length === 0;
};
const fetchHomepageTemplate = async (homepageCategoryId: number) => {
  const { fetchCategoryTemplate } = useCategoryTemplate();
  const { data } = await fetchCategoryTemplate(homepageCategoryId);
  const parsedData = JSON.parse(data || '{}');

  homepageTemplate.value =
    parsedData && !isEmptyObject(parsedData)
      ? {
          id: parsedData.id,
          hero: parsedData.hero || [],
          valueProposition: parsedData.valueProposition,
          featured: parsedData.featured,
        }
      : homepageTemplateData;
};

/**
 * @description Formats the hero items for the homepage
 * @returns An array of formatted hero items
 */
const formatHeroItems = () => {
  return homepageTemplate.value.hero.map((item) => {
    return {
      image: item.image,
      tagline: item.tagline || '',
      heading: item.heading || '',
      description: item.description || '',
      callToAction: item.callToAction || '',
      link: item.link || '',
    };
  });
};

/**
 * @description Formats the media data for the homepage
 * @returns An array of formatted media items
 */
const formatMediaData = () => {
  return homepageTemplate.value.valueProposition.map((media: MediaItemProps) => ({
    image: media.image,
    text: media.text,
    alignment: media.alignment,
    alt: media.alt,
  }));
};

export const useHomePageState: UseHomepageDataReturn = () => {
  const state = useState<UseHomepageDataState>('useHomepageState', () => ({
    data: [] as HomeData[],
    loading: false,
    showErrors: false,
  }));

  const hero = ref<HeroContentProps[]>([]);
  const valueProposition = ref<MediaItemProps[]>([]);

  /**
   * @description Fetches the homepage data and updates the state
   */
  const fetchData = async (): Promise<void> => {
    state.value.loading = true;
    const homepageCategoryId = runtimeConfig.public.homepageCategoryId;
    if (typeof homepageCategoryId === 'number') {
      await fetchHomepageTemplate(homepageCategoryId);
    } else {
      isEditingDisabled.value = true;
    }

    const mediaData = formatMediaData();
    const formattedHeroItems = formatHeroItems();

    const homeData: HomeData = {
      id: homepageTemplate.value.id,
      hero: formattedHeroItems,
      valueProposition: mediaData,
    };

    state.value.data.push(homeData);
    state.value.loading = false;

    if (state.value.data.length > 0) {
      const firstItem = state.value.data[0];
      hero.value = firstItem.hero;
      valueProposition.value = firstItem.valueProposition;
    }
  };

  /**
   * @description Saves the homepage data
   */
  const saveData = async (): Promise<void> => {
    const { setCategoryTemplate } = useCategoryTemplate();
    const homepageCategoryId = runtimeConfig.public.homepageCategoryId;
    await setCategoryTemplate(homepageCategoryId, JSON.stringify(state.value.data));
  };

  /**
   * @description Sets the formatted hero items in the state
   * @param item An array of HomeData objects
   */
  const setFormattedHeroItems = (item: HomeData[]) => {
    state.value.data = item;
  };

  // Watch for changes in state.value.data and update hero and valueProposition
  watch(
    () => state.value.data,
    (updatedData) => {
      if (updatedData.length > 0) {
        const firstItem = updatedData[0];
        hero.value = firstItem.hero;
        valueProposition.value = firstItem.valueProposition;
      } else {
        hero.value = [];
        valueProposition.value = [];
      }
    },
    { deep: true },
  );

  return {
    fetchData,
    saveData,
    ...toRefs(state.value),
    setFormattedHeroItems,
    hero,
    valueProposition,
  };
};
