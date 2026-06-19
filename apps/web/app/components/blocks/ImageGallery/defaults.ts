import type { BlocksList } from '~/composables/useBlocksList/types';

const blocksList = {
  'item-page': {
    category: 'item-page',
    accessControl: ['product'],
    title: 'Item Page',
    blockName: 'ItemPage',
    variations: [
      {
        title: 'Image Gallery',
        image: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/preview-thumbs-left.png',
        template: {
          en: {
            name: 'ImageGallery',
            type: 'content',
            meta: {
              uuid: 'c6f1e2d3-4c5a-6c7d-8e9f-0a1b2c3d4e5e',
              isGlobalTemplate: false,
            },
            parent_slot: 0,
            content: {
              thumbnails: {
                showThumbnails: true,
                thumbnailType: 'left-vertical',
                enableHoverZoom: true,
              },
            },
          },
          de: {
            name: 'ImageGallery',
            type: 'content',
            meta: {
              uuid: 'c6f1e2d3-4c5a-6c7d-8e9f-0a1b2c3d4e5e',
              isGlobalTemplate: false,
            },
            parent_slot: 0,
            content: {
              thumbnails: {
                showThumbnails: true,
                thumbnailType: 'left-vertical',
                enableHoverZoom: true,
              },
            },
          },
        },
      },
    ],
  },
};

export const getBlocksList = (): BlocksList => blocksList as unknown as BlocksList;
