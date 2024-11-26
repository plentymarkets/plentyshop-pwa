// import { HeroContentProps } from '~/components/ui/HeroCarousel/types';
import { MediaItemProps } from '~/components/ui/MediaCard/types';

// export type Featured = {
//   headline: string;
//   categoryId: string;
// };
//
// // export interface HomeData {
// //   hero: HeroContentProps[];
// //   mediaCard: MediaItemProps[];
// //   featured: Featured[];
// // }
// export type BlockData = {
//   name: string;
//   options: HeroContentProps[] | MediaItemProps[] | Featured[];
// };
//
// export interface HomeData {
//   heroContent: HeroContentProps[];
//   mediaContent: MediaItemProps[];
//   featuredContent: Featured[];
// }
// Interface for the Image sizes
interface ImageProps {
  lg: string;
  md: string;
  sm: string;
  xs: string;
}

interface HeroContentProps {
  image: ImageProps;
  tagline: string;
  taglineColor: string;
  heading: string;
  headingColor: string;
  description: string;
  alt: string;
  descriptionColor: string;
  callToAction: string;
  link: string;
}

interface UiHeroCarouselOptions {
  hero: HeroContentProps[];
}

interface UiMediaCardOptions {
  text: string;
  image: string;
  alt: string;
  alignment: string;
}

interface ProductRecommendedProductsOptions {
  categoryId: string;
}

type BlockOptions = UiHeroCarouselOptions | UiMediaCardOptions | ProductRecommendedProductsOptions;

export interface Block {
  name: string;
  options: BlockOptions;
}

export interface HomepageData {
  blocks: Block[];
}

export interface UseHomepageDataState {
  data: HomepageData;
  loading: boolean;
  showErrors: boolean;
}

export interface UseHomepage {
  data: Readonly<Ref<UseHomepageDataState['data']>>;
  loading: Ref<boolean>;
  showErrors: Readonly<Ref<boolean>>;
  fetchPageTemplate: () => void;
  // hero: Readonly<Ref<HeroContentProps[]>>;
  // mediaCard: Readonly<Ref<MediaItemProps[]>>;
  // recommendedProductsCategories: Readonly<Ref<Featured[]>>;
  // setFormattedHeroItems: (items: HomeData) => void;
}

export type UseHomepageDataReturn = () => UseHomepage;
