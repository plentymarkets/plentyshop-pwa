import { MediaItemProps } from '~/components/ui/MediaCard/types';
import { HeroContentProps } from '~/components/ui/HeroCarousel/types';

const heroItemProps = ref<HeroContentProps[]>([]);
const mediaDataProps = ref<MediaItemProps[]>([]);
export function useHomepageEditorData() {
  const updateHeroItems = (updatedData: Array<any>) => {
    heroItemProps.value = updatedData;
  };

  const updateMediaData = (updatedData: Array<any>) => {
    mediaDataProps.value = updatedData;
  };

  return {
    heroItemProps,
    mediaDataProps,
    updateHeroItems,
    updateMediaData,
  };
}
