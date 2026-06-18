import type { BlocksListContribution } from '~/composables/useBlocksList/types';

export default {
  layout: {
    category: 'layout',
    accessControl: ['content', 'productCategory', 'product'],
    title: 'Layout',
    blockName: 'MultiGrid',
    variations: [
      {
        title: 'MultiGrid 6-6',
        image: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/two-column-grid.png',
        template: {
          en: {
            name: 'MultiGrid',
            type: 'structure',
            meta: {
              uuid: '64893934-ce1b-461e-8263-da8df6753872',
            },
            configuration: {
              columnWidths: [6, 6],
              fullWidth: false,
            },
            content: [
              {
                name: 'EmptyGridBlock',
                type: 'content',
                meta: {
                  uuid: '12345678-1234-4123-8123-123456789012',
                },
                parent_slot: 0,
                content: [],
              },
              {
                name: 'EmptyGridBlock',
                type: 'content',
                meta: {
                  uuid: '23456789-2345-4234-8234-234567890123',
                },
                parent_slot: 1,
                content: [],
              },
            ],
          },
          de: {
            name: 'MultiGrid',
            type: 'structure',
            meta: {
              uuid: '64893934-ce1b-461e-8263-da8df6753872',
            },
            configuration: {
              columnWidths: [6, 6],
              fullWidth: false,
            },
            content: [
              {
                name: 'EmptyGridBlock',
                type: 'content',
                meta: {
                  uuid: '12345678-1234-4123-8123-123456789012',
                },
                parent_slot: 0,
                content: [],
              },
              {
                name: 'EmptyGridBlock',
                type: 'content',
                meta: {
                  uuid: '23456789-2345-4234-8234-234567890123',
                },
                parent_slot: 1,
                content: [],
              },
            ],
          },
        },
      },
      {
        title: 'MultiGrid 4-4-4',
        image: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/three-column-grid.png',
        template: {
          en: {
            name: 'MultiGrid',
            type: 'structure',
            meta: {
              uuid: '64893934-ce1b-461e-8263-da8df6753872',
            },
            configuration: {
              columnWidths: [4, 4, 4],
              fullWidth: false,
            },
            content: [
              {
                name: 'EmptyGridBlock',
                type: 'content',
                meta: {
                  uuid: '12345678-1234-4123-8123-123456789012',
                },
                parent_slot: 0,
                content: [],
              },
              {
                name: 'EmptyGridBlock',
                type: 'content',
                meta: {
                  uuid: '23456789-2345-4234-8234-234567890123',
                },
                parent_slot: 1,
                content: [],
              },
              {
                name: 'EmptyGridBlock',
                type: 'content',
                meta: {
                  uuid: '34567890-3456-4345-8345-345678901234',
                },
                parent_slot: 2,
                content: [],
              },
            ],
          },
          de: {
            name: 'MultiGrid',
            type: 'structure',
            meta: {
              uuid: '64893934-ce1b-461e-8263-da8df6753872',
            },
            configuration: {
              columnWidths: [4, 4, 4],
              fullWidth: false,
            },
            content: [
              {
                name: 'EmptyGridBlock',
                type: 'content',
                meta: {
                  uuid: '12345678-1234-4123-8123-123456789012',
                },
                parent_slot: 0,
                content: [],
              },
              {
                name: 'EmptyGridBlock',
                type: 'content',
                meta: {
                  uuid: '23456789-2345-4234-8234-234567890123',
                },
                parent_slot: 1,
                content: [],
              },
              {
                name: 'EmptyGridBlock',
                type: 'content',
                meta: {
                  uuid: '34567890-3456-4345-8345-345678901234',
                },
                parent_slot: 2,
                content: [],
              },
            ],
          },
        },
      },
    ],
  },
} satisfies BlocksListContribution;
