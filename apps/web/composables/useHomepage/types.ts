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

interface UiHeroCarouselOptions {
  hero: HeroContentProps[];
}

interface UiMediaCardOptions {
  text?: string;
  image?: string;
  alt?: string;
  alignment?: string;
}

export interface ProductRecommendedProductsOptions {
  categoryId: string;
  headline?: string;
}
interface NewsletterSubscribeOptions {
  email: string;
  firstName: string;
  heading: string;
  info: string;
  lastName: string;
  policy: string;
  subscribe: string;
  success: string;
}

type BlockOptions =
  | UiHeroCarouselOptions
  | UiMediaCardOptions
  | ProductRecommendedProductsOptions
  | NewsletterSubscribeOptions;

export interface Block {
  name: string;
  options: BlockOptions;
}

export interface HomepageData {
  blocks: Block[];
  meta?: { isDefault: boolean | null };
}

export interface UseHomepageDataState {
  data: HomepageData;
  initialBlocks: Block[];
  dataIsEmpty: boolean;
  loading: boolean;
  showErrors: boolean;
}

export interface UseHomepage {
  data: Readonly<Ref<UseHomepageDataState['data']>>;
  initialBlocks: Ref<UseHomepageDataState['initialBlocks']>;
  dataIsEmpty: Readonly<Ref<UseHomepageDataState['dataIsEmpty']>>;
  loading: Ref<boolean>;
  showErrors: Readonly<Ref<boolean>>;
  fetchPageTemplate: () => void;
}

export type UseHomepageDataReturn = () => UseHomepage;
