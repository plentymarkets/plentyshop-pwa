import type { SlideControls } from '~/composables/useHomepage/types';

export type Size = {
  width: string;
  height: string;
};

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

export type BannerProps = {
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
    textAlignment?: 'left' | 'center' | 'right';
    justify?: 'top' | 'center' | 'bottom';
    align?: 'left' | 'center' | 'right';
    background?: boolean;
  };
  button: {
    label?: string;
    link?: string;
    variant?: 'primary' | 'secondary';
  };
};

export interface BannerSlide {
  bannerItems: BannerProps[];
  controls: SlideControls;
}
