export type ImageTextProps = {
  text?: {
    pretitle?: string;
    title?: string;
    subtitle?: string;
    htmlDescription?: string;
    textAlignment?: 'left' | 'center' | 'right';
  };
  button?: {
    label?: string;
    link?: string;
    variant?: 'primary' | 'secondary';
  };
  image?:{
    imageLink: string;
    alt: string;
    imageAlignment: 'left' | 'right';
  }
};

