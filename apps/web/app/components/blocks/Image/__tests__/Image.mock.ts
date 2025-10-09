import type { ImageProps } from '../types';

export const imageBlockUuid = '45454545-4545-4455-8455-454545454545';

export const mockImageBlock: ImageProps = {
  name: 'Image',
  type: 'content',
  meta: { uuid: imageBlockUuid },
  content: {
    image: {
      wideScreen: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
      desktop: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
      tablet: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
      mobile: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
      alt: 'Test alt',
      imageAlignment: 'right',
      fillMode: 'fill',
      aspectRatio: '16 / 9',
      linktarget: '',
    },
    text: {
      textOverlay: 'Overlay',
      textOverlayColor: '#333333',
      textOverlayAlignY: 'center',
      textOverlayAlignX: 'center',
    },
    button: {
      label: 'Test button',
      link: '/test-link',
      variant: 'primary',
    },
    layout: {
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      backgroundColor: '#fff',
    },
  },
};
