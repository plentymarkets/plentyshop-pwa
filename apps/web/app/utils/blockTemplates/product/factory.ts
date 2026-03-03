import type { Block } from '@plentymarkets/shop-api';
import { v4 as uuid } from 'uuid';
import { createFooter } from '../footer/factory';

export const createProduct = (): Block[] => {
  const itemTextTitle = t('defaultTemplate.product.itemText.title');
  const technicalDataTitle = t('defaultTemplate.product.technicalData.title');
  const customerReviewTitle = t('defaultTemplate.product.customerReview.title');
  const legalInfoTitle = t('defaultTemplate.product.productLegalInformation.title');
  const legalInfoLinkText = t('defaultTemplate.product.productLegalInformation.linkText');

  return [
    {
      name: 'MultiGrid',
      type: 'structure',
      meta: {
        uuid: uuid(),
        isGlobalTemplate: false,
      },
      configuration: {
        columnWidths: [6, 6],
        sticky: [1],
        layout: {
          marginTop: '0',
          marginBottom: '0',
        },
      },
      layout: {
        gap: 'XL',
        narrowContainer: true,
      },
      content: [
        {
          name: 'ImageGallery',
          type: 'content',
          meta: {
            uuid: uuid(),
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
        {
          name: 'PriceCard',
          type: 'content',
          meta: {
            uuid: uuid(),
            isGlobalTemplate: false,
          },
          parent_slot: 1,
          content: {
            fields: {
              itemName: true,
              price: true,
              tags: true,
              availability: true,
              starRating: true,
              orderProperties: true,
              variationProperties: true,
              previewText: true,
              attributes: true,
              itemBundle: false,
              graduatedPrices: false,
              addToWishlist: true,
              quantityAndAddToCart: true,
              itemText: false,
              technicalData: false,
            },
            fieldsOrder: [
              'itemName',
              'price',
              'tags',
              'availability',
              'starRating',
              'variationProperties',
              'orderProperties',
              'previewText',
              'attributes',
              'itemBundle',
              'graduatedPrices',
              'addToWishlist',
              'quantityAndAddToCart',
              'itemText',
              'technicalData',
            ],
            fieldsDisabled: ['quantityAndAddToCart', 'price', 'itemBundle', 'attributes'],
            wishlistSize: 'small',
            dropShadow: true,
            borders: true,
            borderColor: '#EFF4F1',
            layout: {
              paddingTop: 0,
              paddingBottom: 0,
              paddingRight: 0,
              paddingLeft: 0,
            },
          },
        },
      ],
    },
    {
      name: 'ItemText',
      type: 'content',
      meta: {
        uuid: uuid(),
        isGlobalTemplate: false,
      },
      content: {
        text: {
          title: itemTextTitle,
        },
        layout: {
          displayAsCollapsable: true,
          initiallyCollapsed: false,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
        },
      },
    },
    {
      name: 'TechnicalData',
      type: 'content',
      meta: {
        uuid: uuid(),
        isGlobalTemplate: false,
      },
      content: {
        text: {
          title: technicalDataTitle,
        },
        layout: {
          displayAsCollapsable: true,
          initiallyCollapsed: false,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
        },
      },
    },
    {
      name: 'CustomerReview',
      type: 'content',
      meta: {
        uuid: uuid(),
        isGlobalTemplate: false,
      },
      content: {
        text: {
          title: customerReviewTitle,
        },
        layout: {
          collapsible: true,
          initiallyCollapsed: false,
        },
      },
    },
    {
      name: 'ProductLegalInformation',
      type: 'content',
      meta: {
        uuid: uuid(),
        isGlobalTemplate: false,
      },
      content: {
        text: {
          title: legalInfoTitle,
          linkText: legalInfoLinkText,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 15,
          paddingRight: 0,
        },
      },
    },
    {
      name: 'ProductRecommendedProducts',
      type: 'content',
      meta: {
        uuid: uuid(),
        isGlobalTemplate: false,
      },
      content: {
        source: {
          type: 'category',
          itemId: '',
          categoryId: '',
          crossSellingRelation: 'Similar',
        },
      },
    },
    createFooter(),
  ] as Block[];
};
