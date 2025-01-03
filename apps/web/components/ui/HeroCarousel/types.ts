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

export type HeroContentProps2 = {
  image: {
    lg: string;
    md: string;
    sm: string;
    xs: string;
    alt: string;
    brightness: number;
  };
  text: {
    color: string;
    bgcolor: string;
    pretitle: string;
    title: string;
    subtitle: string;
    description: string;
    descriptionIsHtml: boolean;
    textAlignment: 'left' | 'center' | 'right';
    justify: 'start' | 'center' | 'end';
    align: 'start' | 'center' | 'end';
  };
  button: {
    label: string;
    link: string;
    variant: 'primary' | 'secondary';
  };
};
