import type {
  BlockProps,
  ButtonSection,
  FillMode,
  VerticalAlignment,
  TextAlignment,
  PaddingLayout,
} from '~/types/blocks';

export type ImageProps = BlockProps<ImageContent>;

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
    fillMode?: FillMode;
    aspectRatio?: string;
  };
  text: {
    textOverlay?: string;
    textOverlayColor?: string;
    textOverlayAlignY?: VerticalAlignment;
    textOverlayAlignX?: TextAlignment;
  };
  button: ButtonSection;
  layout: PaddingLayout & {
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
