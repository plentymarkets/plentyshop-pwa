import type { BlocksList } from '~/composables/useBlocksList/types';

const blocksList = {
  forms: {
    category: 'forms',
    accessControl: ['content', 'productCategory', 'product'],
    title: 'Forms',
    blockName: 'NewsletterSubscribe',
    variations: [
      {
        title: 'Forms Preview',
        image: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/forms_preview.png',
        template: {
          en: {
            name: 'NewsletterSubscribe',
            type: 'content',
            meta: {
              uuid: '4d5e6f70-8192-4c3d-8e4f-4567890abcde',
            },
            content: {
              text: {
                bgColor: '#f5f5f5',
                title: 'Newsletter',
                htmlDescription: '<p style="text-align: center;">Text that supports HTML formatting</p>',
              },
              input: {
                displayNameInput: true,
                nameIsRequired: false,
              },
              button: {
                label: 'Subscribe',
              },
              settings: {
                emailFolderId: 1,
              },
              layout: {
                fullWidth: false,
              },
            },
          },
          de: {
            name: 'NewsletterSubscribe',
            type: 'content',
            meta: {
              uuid: '5e6f7081-92a3-4d4e-8f50-567890abcdef',
            },
            content: {
              text: {
                bgColor: '#f5f5f5',
                title: 'Abonnieren Sie unseren Newsletter',
                htmlDescription: '<p style="text-align: center;">Text mit HTML-Formatierung</p>',
              },
              input: {
                displayNameInput: true,
                nameIsRequired: false,
              },
              button: {
                label: 'Newsletter abonnieren',
              },
              settings: {
                emailFolderId: 1,
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
