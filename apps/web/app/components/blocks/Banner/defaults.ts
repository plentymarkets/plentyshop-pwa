import { v4 as uuid } from 'uuid';
import type { BannerProps } from './types';

export const createDefault = (index: number): BannerProps => ({
  name: 'Banner',
  type: 'content',
  configuration: {
    visible: true,
  },
  content: {
    image: {
      wideScreen: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
      desktop: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
      tablet: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
      mobile: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
      brightness: 0.5,
      alt: '',
    },
    text: {
      pretitle: 'PreTitle',
      title: 'Title',
      subtitle: 'SubTitle',
      htmlDescription: 'Text that supports HTML formatting',
      color: '#000',
      bgcolor: '#fff',
      bgopacity: 1,
      textAlignment: 'left',
      justify: 'center',
      align: 'left',
      background: false,
    },
    button: {
      label: 'Button',
      link: '/',
      variant: 'primary',
    },
  },
  meta: {
    uuid: uuid(),
  },
  lazyLoading: 'eager',
  index,
});
