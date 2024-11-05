import { HeroContentProps } from '~/components/ui/HeroCarousel/types';
import { MediaItemProps } from '~/components/ui/MediaCard/types';

export interface HomeData {
  id: number;
  hero: HeroContentProps[];
  valueProposition: MediaItemProps[];
}

export interface UseHomepageDataState {
  mediaData: MediaItemProps[];
  hero: HeroContentProps[];
  data: HomeData[];
  loading: boolean;
  showErrors: boolean;
}

export type FormattedHeroItems = HeroContentProps[];
export type MediaData = MediaItemProps[];

export interface UseHomepageMethods {
  data: Readonly<Ref<UseHomepageDataState['data']>>;
  loading: Readonly<Ref<boolean>>;
  showErrors: Readonly<Ref<boolean>>;
  setHomepageTemplate: Readonly<Ref<HomeData[]>>;
  setFormattedHeroItems: FormattedHeroItems;
  setMediaData: MediaData;
}
export type DoHomepageData = () => UseHomepageDataState;

export type UseHomepageDataReturn = () => UseHomepageMethods;
