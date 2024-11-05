import { MediaItemProps } from '~/components/ui/MediaCard/types';
import { HeroContentProps } from '~/components/ui/HeroCarousel/types';

export const useHomePageState = () => {
  const state = useState<UseHomepageDataState>('useHomepageState', () => ({
    data: [] as HomeData[],
    hero: [] as HeroContentProps[],
    mediaData: [] as MediaItemProps[],
    loading: false,
    showErrors: false,
  }));

  const setFormattedHeroItems = (items: HeroContentProps[]) => {
    state.value.hero = items;
    console.log('state.value.hero', state.value.hero);
  };

  const setMediaData = (media: MediaItemProps[]) => {
    state.value.mediaData = media;
  };

  const setHomepageTemplate = (template: HomeData[]) => {
    state.value.data = template;
  };

  return {
    ...toRefs(state.value),
    setFormattedHeroItems,
    setMediaData,
    setHomepageTemplate,
  };
};
