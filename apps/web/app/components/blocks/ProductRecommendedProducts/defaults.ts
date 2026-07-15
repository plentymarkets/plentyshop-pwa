import type { BlocksList } from '~/composables/useBlocksList/types';

const blocksList = {
  'product-galleries': {
    category: 'product-galleries',
    accessControl: ['content', 'productCategory', 'product'],
    title: 'Products',
    blockName: 'ProductRecommendedProducts',
    variations: [
      {
        title: 'Product Galleries',
        image: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/product_galleries.png',
        template: {
          en: {
            name: 'ProductRecommendedProducts',
            type: 'content',
            meta: {
              uuid: '2b3c4d5e-6f70-4a1b-8c2d-234567890abc',
            },
            content: {
              text: {
                htmlDescription: '<p style="text-align: left;">Text that supports HTML formatting</p>',
              },
              layout: {
                fullWidth: false,
              },
              source: {
                type: 'category',
                itemId: '',
                categoryId: '',
              },
            },
          },
          de: {
            name: 'ProductRecommendedProducts',
            type: 'content',
            meta: {
              uuid: '3c4d5e6f-7081-4b2c-8d3e-34567890abcd',
            },
            content: {
              text: {
                htmlDescription: '<p style="text-align: left;">Text mit HTML-Formatierung</p>',
              },
              layout: {
                fullWidth: false,
              },
              source: {
                type: 'category',
                itemId: '',
                categoryId: '',
              },
            },
          },
        },
      },
    ],
  },
};

export const getBlocksList = (): BlocksList => blocksList as unknown as BlocksList;
