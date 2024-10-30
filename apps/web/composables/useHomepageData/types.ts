export type Size = {
  width: string;
  height: string;
};

export type SizeKey = 'lg' | 'md' | 'sm' | 'xs';

export type Sizes = Record<SizeKey, { width: string; height: string }>;

export type HeroItem = {
  image?: string;
  alt?: string;
  tagline?: string;
  taglineColor?: string;
  heading?: string;
  headingColor?: string;
  description?: string;
  descriptionColor?: string;
  callToAction?: string;
  link?: string;
  backgroundSizes: Sizes;
  actualBackgroundSize: SizeKey;
};

export type MediaItem = {
  text: string;
  image: string;
  alt: string;
  alignment: string;
};

export type HeroCarouselProps = {
  background: { image: string; sizes: Sizes };
  hero: HeroItem[];
};
