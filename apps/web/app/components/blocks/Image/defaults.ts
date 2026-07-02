import type { BlocksList } from '~/composables/useBlocksList/types';

const blocksList = {
  image: {
    category: 'image',
    accessControl: ['content', 'productCategory', 'product'],
    title: 'Image',
    blockName: 'Image',
    variations: [
      {
        title: 'Image',
        image: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/image_preview.png',
        template: {
          en: {
            name: 'Image',
            type: 'content',
            meta: {
              uuid: '45454545-4545-4455-8455-454545454545',
            },
            content: {
              image: {
                wideScreen: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                desktop: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                tablet: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                mobile: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                alt: 'alt text',
                imageAlignment: 'right',
                fillMode: 'fill',
                aspectRatio: '16 / 9',
              },
              text: {
                textOverlay: '',
                textOverlayColor: '#333333',
                textOverlayAlignY: 'center',
                textOverlayAlignX: 'center',
              },
              button: {
                label: '',
                link: '',
                variant: 'primary',
              },
              layout: {
                fullWidth: false,
              },
            },
          },
          de: {
            name: 'Image',
            type: 'content',
            meta: {
              uuid: '45454545-4545-4455-8455-454545454545',
            },
            content: {
              image: {
                wideScreen: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                desktop: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                tablet: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                mobile: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                alt: 'alt text',
                imageAlignment: 'right',
                fillMode: 'fill',
                aspectRatio: '16 / 9',
              },
              text: {
                textOverlay: '',
                textOverlayColor: '#333333',
                textOverlayAlignY: 'center',
                textOverlayAlignX: 'center',
              },
              button: {
                label: '',
                link: '',
                variant: 'primary',
              },
              layout: {
                fullWidth: false,
              },
            },
          },
        },
      },
    ],
  },
};

export const getBlocksList = (): BlocksList => blocksList as unknown as BlocksList;
