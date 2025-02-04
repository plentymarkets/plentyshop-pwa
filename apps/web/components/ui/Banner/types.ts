export type BannerProps = {
  controls?: {
    color?: string;
  };
  image?: {
    desktop?: string;
    tablet?: string;
    mobile?: string;
    alt?: string;
    brightness?: number;
  };
  text?: {
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
  };
  button?: {
    label?: string;
    link?: string;
    variant?: 'primary' | 'secondary';
  };
};

export type Slide = {
  controls?: {
    color?: string;
  };
  image: {
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
  };
  button: {
    label?: string;
    link?: string;
    variant?: 'primary' | 'secondary';
  };
};
