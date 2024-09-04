export type Size = {
  width: string;
  height: string;
};

export type Sizes = {
  lg: Size;
  md: Size;
  sm: Size;
};

export type HeroItem = {
  subtitle: string;
  title: string;
  description: string;
  primaryButtonLink: string;
  primaryButtonText: string;
  image: string;
  backgroundSizes: Sizes;
};
export type HeroCarouselProps = {
  headPhones: { image: string; sizes: Sizes };
  background: { image: string; sizes: Sizes };
  items: HeroItem[];
};
