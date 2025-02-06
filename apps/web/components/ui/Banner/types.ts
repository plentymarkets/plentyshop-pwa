export type BannerProps = {
  controls: {
    color?: string;
  };
  image: {
    xl?: string;
    lg?: string;
    md?: string;
    sm?: string;
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
