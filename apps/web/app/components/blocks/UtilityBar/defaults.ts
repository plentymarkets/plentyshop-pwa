import type { BlocksList } from '~/composables/useBlocksList/types';

const blocksList = {
  header: {
    category: 'header',
    accessControl: ['content'],
    title: 'Header',
    blockName: 'Header',
    variations: [
      {
        title: 'Utility Bar Default',
        image: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/utility-bar-thumbnail.svg',
        template: {
          en: {
            name: 'UtilityBar',
            type: 'content',
            meta: {
              uuid: '12345678-1234-5678-1234-567812345678',
            },
            content: {
              layout: {
                paddingTop: 20,
                paddingBottom: 20,
                paddingLeft: 40,
                paddingRight: 40,
              },
              sectionOrder: {
                sections: ['logo', 'search', 'actions'],
              },
              sectionVisibility: {
                logo: true,
                search: true,
                actions: true,
              },
              color: {
                iconColor: '#ffffff',
                backgroundColor: 'rgb(var(--colors-2-primary-500))',
              },
              search: {
                displayMode: 'full',
              },
              actions: {
                order: ['language', 'wishlist', 'cart', 'account'],
                visibility: {
                  language: true,
                  wishlist: true,
                  cart: true,
                  account: true,
                },
              },
            },
          },
          de: {
            name: 'UtilityBar',
            type: 'content',
            meta: {
              uuid: '12345678-1234-5678-1234-567812345678',
            },
            content: {
              layout: {
                paddingTop: 20,
                paddingBottom: 20,
                paddingLeft: 40,
                paddingRight: 40,
              },
              sectionOrder: {
                sections: ['logo', 'search', 'actions'],
              },
              sectionVisibility: {
                logo: true,
                search: true,
                actions: true,
              },
              color: {
                iconColor: '#ffffff',
                backgroundColor: 'rgb(var(--colors-2-primary-500))',
              },
              search: {
                displayMode: 'full',
              },
              actions: {
                order: ['language', 'wishlist', 'cart', 'account'],
                visibility: {
                  language: true,
                  wishlist: true,
                  cart: true,
                  account: true,
                },
              },
            },
          },
        },
      },
    ],
  },
};

export const getBlocksList = (): BlocksList => blocksList as unknown as BlocksList;
