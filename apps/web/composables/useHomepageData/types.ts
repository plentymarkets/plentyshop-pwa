import { HeroContentProps } from '~/components/ui/HeroCarousel/types';
import { MediaItemProps } from '~/components/ui/MediaCard/types';

export type FormattedHeroItems = HeroContentProps[];
export type MediaData = MediaItemProps[];

export interface UseHomepageMethods {
  data: Readonly<Ref<UseHomepageDataState['data']>>;
  loading: Readonly<Ref<boolean>>;
  showErrors: Readonly<Ref<boolean>>;
  formattedHeroItems: FormattedHeroItems;
  mediaData: MediaData;
  recommendedProductsCategoryId: string;
}
