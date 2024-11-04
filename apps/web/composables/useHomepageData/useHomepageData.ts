import { ref, watch, computed } from 'vue';
import { HeroContentProps, SizeKey } from '~/components/ui/HeroCarousel/types';
import { MediaItemProps } from '~/components/ui/MediaCard/types';
import { useCategoryTree, useCategoryTemplate } from '~/composables';
import homepageTemplateData from './homepageTemplateData.json';
// import { UseHomepageData, UseHomepageDataState } from '~/composables/useHomepageData/types';

const resolveImage = (imageSizes: Record<SizeKey, string>, sizeKey: SizeKey): string => {
  return imageSizes[sizeKey] || '';
};
export const useHomepageData: UseHomepageData = () => {
  const state = useState<UseHomepageData>('UseHomepageData');
  state.data = [];
  state.loading = false;
  state.showErrors = false;

}

const useHomepageData = async () => {
  const viewport = useViewport();
  const { data: categoryTree } = useCategoryTree();
  const recommendedProductsCategoryId = ref('');

  const runtimeConfig = useRuntimeConfig();
  const homepageTemplate = ref(homepageTemplateData);

  const homepageCategoryId = runtimeConfig.public.homepageCategoryId;
  const { fetchCategoryTemplate } = useCategoryTemplate();

  if (typeof homepageCategoryId === 'number') {
    const { data } = await fetchCategoryTemplate(homepageCategoryId);
    const parsedData = JSON.parse(data);
    if (parsedData) {
      homepageTemplate.value = {
        id: parsedData.id,
        hero: parsedData.hero || [],
        valueProposition: parsedData.valueProposition,
        featured: parsedData.featured,
      };
    }
  }

  const getCurrentSizeKey = (): SizeKey => viewport.breakpoint.value as SizeKey;

  const mediaData = computed(() =>
    homepageTemplate.value.valueProposition.map((media: MediaItemProps) => ({
      image: media.image,
      text: media.text,
      alignment: media.alignment,
      alt: media.alt,
    })),
  );

  const formattedHeroItems = computed<HeroContentProps[]>(() => {
    const currentSizeKey = getCurrentSizeKey();
    return homepageTemplate.value.hero.map((item) => {
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
      } as HeroContentProps;
    });
  });

  watch(
    () => categoryTree.value,
    () => {
      const firstCategoryId = categoryTree.value?.[0]?.id;
      if (firstCategoryId) recommendedProductsCategoryId.value = firstCategoryId.toString();
    },
    { immediate: true },
  );

  return {
    formattedHeroItems,
    mediaData,
    recommendedProductsCategoryId,
  };
};
export default useHomepageData;
