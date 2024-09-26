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
  image: string;
  tagline: string;
  heading: string;
  description: string;
  callToAction: string;
  link: string;
  backgroundSizes?: Sizes;
};
export type HeroCarouselProps = {
  background: { image: string; sizes: Sizes };
  hero: HeroItem[];
};
