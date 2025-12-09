import type { BlockProps, ButtonSection, TextAlignment, VerticalAlignment } from '~/types/blocks';

export type Size = {
  width: string;
  height: string;
};

export interface SlideControls {
  color: string;
}

export type SizeKey = 'lg' | 'md' | 'sm' | 'xs';

export type Sizes = Record<SizeKey, { width: string; height: string }>;

export type HeroContentProps = {
  image?: Record<SizeKey, string> | object;
  alt?: string;
  tagline?: string;
  taglineColor?: string;
  heading?: string;
  headingColor?: string;
  description?: string;
  descriptionColor?: string;
  callToAction?: string;
  link?: string;
};

export type BannerProps = BlockProps<BannerContent> & {
  lazyLoading: 'lazy' | 'eager';
};

export type BannerContent = {
  image: {
    wideScreen?: string;
    desktop?: string;
    tablet?: string;
    mobile?: string;
    alt?: string;
    brightness?: number;
  };
  text: {
    color?: string;
    bgcolor?: string;
    bgopacity?: number;
    pretitle?: string;
    title?: string;
    subtitle?: string;
    htmlDescription?: string;
    textAlignment?: TextAlignment;
    justify?: VerticalAlignment;
    align?: TextAlignment;
    background?: boolean;
  };
  button: ButtonSection;
};

export type BannerFormProps = {
  uuid?: string;
};
