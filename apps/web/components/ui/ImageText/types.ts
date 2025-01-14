export interface ImageSource {
  src: string;
  width: number;
  height: number;
}

export type ImageTextProps = {
  image?: {
    desktop?: ImageSource;
    tablet?: ImageSource;
    mobile?: ImageSource;
    alt: string;
    imageAlignment: 'left' | 'right';
  };

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
};
