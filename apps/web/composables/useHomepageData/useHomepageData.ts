import { HeroContentProps, SizeKey } from '~/components/ui/HeroCarousel/types';
import { MediaItemProps } from '~/components/ui/MediaCard/types';
import { useCategoryTemplate } from '~/composables';
import homepageTemplateDataEn from './homepageTemplateDataEn.json';
import homepageTemplateDataDe from './homepageTemplateDataDe.json';

const resolveImage = (imageSizes: Record<SizeKey, string>, sizeKey: SizeKey): string => {
  return imageSizes[sizeKey] || '';
};

export default async function useHomepageData() {
  const { $i18n } = useNuxtApp();
  let homepageTemplateData = homepageTemplateDataEn;
  if ($i18n.locale === 'de') {
    homepageTemplateData = homepageTemplateDataDe;
  }
  const viewport = useViewport();
  const recommendedProductsCategories = ref(homepageTemplateData.featured);

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
        alt: item.image.alt || '',
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

  return {
    formattedHeroItems,
    mediaData,
    recommendedProductsCategories,
  };
}
