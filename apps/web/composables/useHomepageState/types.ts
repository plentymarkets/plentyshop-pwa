import { HeroContentProps } from '~/components/ui/HeroCarousel/types';
import { MediaItemProps } from '~/components/ui/MediaCard/types';

export type Featured = {
  headline: string;
  categoryId: string;
};

export interface HomeData {
  hero: HeroContentProps[];
  valueProposition: MediaItemProps[];
  featured: Featured[];
}

export interface UseHomepageDataState {
  data: HomeData[];
  loading: boolean;
  showErrors: boolean;
}

export interface UseHomepage {
  data: Readonly<Ref<UseHomepageDataState['data']>>;
  loading: Readonly<Ref<boolean>>;
  showErrors: Readonly<Ref<boolean>>;
  fetchData: () => Promise<void>;
  saveData: () => Promise<void>;
  hero: Readonly<Ref<HeroContentProps[]>>;
  valueProposition: Readonly<Ref<MediaItemProps[]>>;
  recommendedProductsCategories: Readonly<Ref<Featured[]>>;
  setFormattedHeroItems: (items: HomeData[]) => void;
}

export type UseHomepageDataReturn = () => UseHomepage;