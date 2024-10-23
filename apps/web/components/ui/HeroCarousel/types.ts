export type Size = {
  width: string;
  height: string;
};

export type SizeKey = 'lg' | 'md' | 'sm' | 'xs';

export type Sizes = Record<SizeKey, { width: string; height: string }>;

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
