import { ref, computed, readonly, toRefs, watch } from 'vue';
import { HeroContentProps, SizeKey } from '~/components/ui/HeroCarousel/types';
import { MediaItemProps } from '~/components/ui/MediaCard/types';
import { UseHomepageDataReturn, UseHomepageDataState, HomeData } from './types';
import homepageTemplateData from './homepageTemplateData.json';

const resolveImage = (imageSizes: Record<SizeKey, string>, sizeKey: SizeKey): string => {
  return imageSizes[sizeKey] || '';
};

export const useHomePageState: UseHomepageDataReturn = () => {
  const state = ref<UseHomepageDataState>({
    data: [] as HomeData[],
    loading: false,
    showErrors: false,
  });

  const fieldData = ref<never[]>([]);
  const jsonText = ref<string>('');
  const homepageTemplate = ref(homepageTemplateData);

  const viewport = useViewport();
  const { data: categoryTree } = useCategoryTree();
  const recommendedProductsCategoryId = ref('');

  const runtimeConfig = useRuntimeConfig();
  const homepageCategoryId = runtimeConfig.public.homepageCategoryId;
  const { fetchCategoryTemplate } = useCategoryTemplate();

  const fetchTemplate = async () => {
    if (typeof homepageCategoryId === 'number') {
      const { data } = await fetchCategoryTemplate(homepageCategoryId);
      const parsedData = JSON.parse(data);
      if (parsedData) {
        homepageTemplate.value = {
          hero: parsedData.hero || [],
          valueProposition: parsedData.valueProposition,
        };
      }
    }
  };
  fetchTemplate();

  const getCurrentSizeKey = (): SizeKey => viewport.breakpoint.value as SizeKey;

  const mediaData = computed<MediaItemProps[]>(() =>
    homepageTemplate.value.valueProposition.map((media: MediaItemProps) => ({
      image: media.image,
      text: media.text,
      alignment: media.alignment,
      alt: media.alt,
    })),
  );

  const formattedHeroItems = computed<HeroContentProps[]>(() => {
    const currentSizeKey = getCurrentSizeKey();
    return homepageTemplate.value.hero.map((item) => ({
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
    }));
  });

  watch(
    () => categoryTree.value,
    () => {
      const firstCategoryId = categoryTree.value?.[0]?.id;
      if (firstCategoryId) recommendedProductsCategoryId.value = firstCategoryId.toString();
    },
    { immediate: true },
  );

  const jsonState = ref({
    mediaData,
    formattedHeroItems,
  });

  return {
    ...toRefs(state.value),
    fieldData,
    jsonText,
    jsonState: readonly(jsonState),
  };
};
