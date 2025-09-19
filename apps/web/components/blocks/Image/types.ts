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
  image: {
    wideScreen?: string;
    desktop?: string;
    tablet?: string;
    mobile?: string;
    alt: string;
    linktarget?: string;
    imageAlignment: 'left' | 'right';
    brightness?: number;
    fillMode?: 'fit' | 'fill';
  };
  text: {
    textOverlay?: string;
    textOverlayColor?: string;
    textOverlayAlignY?: 'top' | 'center' | 'bottom';
    textOverlayAlignX?: 'left' | 'center' | 'right';
  };
  button: {
    label?: string;
    link?: string;
    variant?: 'primary' | 'secondary';
  };
  layout: {
    paddingTop: number;
    paddingBottom: number;
    paddingLeft: number;
    paddingRight: number;
    backgroundColor?: string;
  };
};

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageFormProps {
  uuid?: string;
}
