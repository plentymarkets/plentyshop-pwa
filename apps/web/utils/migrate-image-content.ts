import type { ImageContent } from '~/components/blocks/Image/types';

type OldContent = {
  index?: number;
  wideScreen?: string;
  desktop?: string;
  tablet?: string;
  mobile?: string;
  alt?: string;
  imageAlignment?: 'left' | 'right';
  brightness?: number;
  textOverlay?: string;
  textOverlayColor?: string;
  textOverlayAlignY?: 'top' | 'center' | 'bottom';
  textOverlayAlignX?: 'left' | 'center' | 'right';
  label?: string;
  link?: string;
  variant?: 'primary' | 'secondary';
};

export function migrateImageContent(content: OldContent | ImageContent): ImageContent {
  if ('image' in content && typeof content.image === 'object') {
    return content as ImageContent;
  }

  const old = content as OldContent;

  return {
    index: old.index,
    image: {
      wideScreen: old.wideScreen ?? '',
      desktop: old.desktop ?? '',
      tablet: old.tablet ?? '',
      mobile: old.mobile ?? '',
      alt: old.alt ?? '',
      imageAlignment: old.imageAlignment ?? 'left',
      brightness: old.brightness ?? 1,
    },
    text: {
      textOverlay: old.textOverlay,
      textOverlayColor: old.textOverlayColor,
      textOverlayAlignY: old.textOverlayAlignY,
      textOverlayAlignX: old.textOverlayAlignX,
    },
    button: {
      label: old.label,
      link: old.link,
      variant: old.variant,
    },
  };
}
