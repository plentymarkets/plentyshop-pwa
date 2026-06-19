import type { BlocksList } from '~/composables/useBlocksList/types';

const blocksList = {
  header: {
    category: 'header',
    accessControl: ['content'],
    title: 'Header',
    blockName: 'Header',
    variations: [
      {
        title: 'Navigation',
        image: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/navigation-thumbnail.svg',
        template: {
          en: {
            name: 'Navigation',
            type: 'content',
            meta: {
              uuid: '87654321-4321-4789-8234-123456789abc',
            },
            content: {
              layout: {
                paddingTop: 20,
                paddingBottom: 20,
                paddingLeft: 20,
                paddingRight: 20,
              },
              text: {
                textAlignment: 'left',
              },
              color: {
                backgroundColor: '#ffffff',
                textColor: '#161A16',
                hoverBackgroundColor: '#f5f5f5',
              },
            },
          },
          de: {
            name: 'Navigation',
            type: 'content',
            meta: {
              uuid: '87654321-4321-4789-8234-123456789abc',
            },
            content: {
              layout: {
                paddingTop: 20,
                paddingBottom: 20,
                paddingLeft: 20,
                paddingRight: 20,
              },
              text: {
                textAlignment: 'left',
              },
              color: {
                backgroundColor: '#ffffff',
                textColor: '#161A16',
                hoverBackgroundColor: '#f5f5f5',
              },
            },
          },
        },
      },
    ],
  },
};

export const getBlocksList = (): BlocksList => blocksList as unknown as BlocksList;
