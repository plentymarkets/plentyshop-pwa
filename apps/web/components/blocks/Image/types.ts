export type ImageProps = {
  name: string;
  type: string;
  content: ImageContent;
  configuration?: object;
  index?: number;
  meta: {
    uuid: string;
  };
};

export type ImageContent = {
  index?: number;
  wideScreen?: string;
  desktop?: string;
  tablet?: string;
  mobile?: string;
  alt: string;
  imageAlignment: 'left' | 'right';
  textOverlay?: string;
  textOverlayColor?: string;
  textOverlayAlignX?: 'top' | 'center' | 'bottom';
  textOverlayAlignY?: 'left' | 'center' | 'right';
  label?: string;
  link?: string;
  variant?: 'primary' | 'secondary';
};

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageFormProps {
  uuid?: string;
}
