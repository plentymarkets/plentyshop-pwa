import type { BlocksList } from '~/composables/useBlocksList/types';

const blocksList = {
  text: {
    category: 'text',
    accessControl: ['content', 'productCategory', 'product'],
    title: 'Text',
    blockName: 'TextCard',
    variations: [
      {
        title: 'Rich Text',
        image: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/rich_text.png',
        template: {
          en: {
            name: 'TextCard',
            type: 'content',
            meta: {
              uuid: '01020304-0506-4070-8090-0a0b0c0d0e0f',
            },
            content: {
              text: {
                htmlDescription: '<p style="text-align: center;">Text that supports HTML formatting</p>',
                textAlignment: 'center',
                color: '#000',
              },
              button: {
                label: 'Button',
                link: '/',
                variant: 'primary',
              },
              layout: {
                fullWidth: false,
              },
            },
          },
          de: {
            name: 'TextCard',
            type: 'content',
            meta: {
              uuid: '1a2b3c4d-5e6f-4111-8abc-1234567890ab',
            },
            content: {
              text: {
                htmlDescription: '<p style="text-align: center;">Text mit HTML-Formatierung</p>',
                textAlignment: 'center',
                color: '#000',
              },
              button: {
                label: 'Button',
                link: '/',
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
