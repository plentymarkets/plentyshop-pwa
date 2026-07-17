import type { ImageContent } from '~/components/blocks/Image/types';
import type { OldImageContent } from './types';

export function migrateImageContent(content: OldImageContent | ImageContent): ImageContent {
  if ('image' in content && typeof content.image === 'object') {
    return content as ImageContent;
  }

  const old = content as OldImageContent;

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
      fillMode: 'fill',
      aspectRatio: '16 / 9',
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
      alignment: 'center',
    },
    layout: {
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      fullWidth: false,
    },
  };
}
