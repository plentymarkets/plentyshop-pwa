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

const resolveImage = (imageSizes: Record<SizeKey, string>, sizeKey: SizeKey): string => {
  return imageSizes[sizeKey] || '';
};

const homepageTemplate = ref(homepageTemplateData);
const runtimeConfig = useRuntimeConfig();

const isEmptyObject = (obj: any) => {
  return Object.keys(obj).length === 0;
};
const fetchHomepageTemplate = async (homepageCategoryId: number) => {
  const { fetchCategoryTemplate } = useCategoryTemplate();

  if (typeof homepageCategoryId !== 'number') {
    homepageTemplate.value = homepageTemplateData;
    return;
  }

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

const formatHeroItems = () => {
  return homepageTemplate.value.hero.map((item) => {
    const viewport = useViewport();
    const getCurrentSizeKey = (): SizeKey => viewport.breakpoint.value as SizeKey;
    const currentSizeKey = getCurrentSizeKey();
    return {
      image: resolveImage(item.image, currentSizeKey),
      tagline: item.tagline || '',
      heading: item.heading || '',
      description: item.description || '',
      callToAction: item.callToAction || '',
      link: item.link || '',
      backgroundSizes: {
        lg: { width: '4000', height: '600' },
        md: { width: '1024', height: '600' },
        sm: { width: '640', height: '752' },
        xs: { width: '250', height: '250' },
      },
      actualBackgroundSize: currentSizeKey,
    };
  });
};

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

  const fetchData = async (): Promise<void> => {
    state.value.loading = true;
    const homepageCategoryId = runtimeConfig.public.homepageCategoryId;
    await fetchHomepageTemplate(homepageCategoryId);
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

  const setFormattedHeroItems = (item: any) => {
    state.value.data = item;
  };

  watch(
    () => state.value.data,
    (updatedData) => {
      if (updatedData.length > 0) {
        const firstItem = updatedData[0];
        hero.value = firstItem.hero;
        valueProposition.value = firstItem.valueProposition;
      }
    },
    { deep: true },
  );

  return {
    fetchData,
    ...toRefs(state.value),
    setFormattedHeroItems,
    hero,
    valueProposition,
  };
};
