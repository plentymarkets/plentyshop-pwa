import type { BannerProps } from '~/components/blocks/BannerCarousel/types';

interface ImageProps {
  lg: string;
  md: string;
  sm: string;
  xs: string;
}

interface HeroContentProps {
  image: ImageProps;
  tagline: string;
  taglineColor?: string;
  heading: string;
  headingColor?: string;
  description: string;
  alt: string;
  descriptionColor?: string;
  callToAction: string;
  link: string;
}

export interface SlideControls {
  color: string;
}

export interface Block {
  name: string;
  type: string;
  configuration?: unknown;
  meta: {
    uuid: string;
  };
  content: unknown;
}

export interface HomepageData {
  blocks: Block[];
  meta?: { isDefault: boolean | null };
}

export interface UseHomepageDataState {
  data: Block[];
  initialBlocks: Block[];
  dataIsEmpty: boolean;
  loading: boolean;
  showErrors: boolean;
  activeSlideIndex: ActiveSlideIndex;
}

export type UpdateBannerItems = (newBannerItems: BannerProps[], blockUuid: string) => void;
export type SetIndex = (blockUuid: string, slideIndex: number) => void;
export type UpdateBlocks = (blocks: Block[]) => void;

export interface UseHomepage {
  data: Readonly<Ref<UseHomepageDataState['data']>>;
  initialBlocks: Ref<UseHomepageDataState['initialBlocks']>;
  dataIsEmpty: Readonly<Ref<UseHomepageDataState['dataIsEmpty']>>;
  activeSlideIndex: Readonly<Ref<UseHomepageDataState['activeSlideIndex']>>;
  loading: Ref<boolean>;
  showErrors: Readonly<Ref<boolean>>;
  fetchPageTemplate: () => void;
  updateBlocks: UpdateBlocks;
}

export type UseHomepageDataReturn = () => UseHomepage;
