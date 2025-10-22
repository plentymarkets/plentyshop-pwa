import type { ImageGalleryProps } from '../types';
// import { mockProduct } from '../../ItemGrid/__tests__/Products.mock';
import type { Product } from '@plentymarkets/shop-api';
import type { ImageGalleryContent } from '~/components/Gallery/types';

export const imageGalleryBlockUuid = '45454545-4545-4455-8455-454545454545';

// import type { Product } from '@plentymarkets/shop-api';

export const mockProduct: Product = {
    facets: [],
    filter: { isSalable: true, isSalableAndActive: true },
    images: { all: [], variation: [] },
    item: {
        id: 1,
        condition: { names: { name: 'New', lang: 'en' } },
        manufacturerId: 1,
        itemType: 'default',
        manufacturer: { externalName: 'Brand', name: 'Brand' },
    },
    prices: undefined,
    properties: [],
    texts: {
        name1: 'Mock Product 1',
        name2: '',
        name3: '',
        urlPath: 'mock-product-1',
        lang: 'en',
        description: '',
        shortDescription: '',
        keywords: '',
        title: '',
        metaDescription: '',
        technicalData: '',
        id: 1,
        itemId: 1,
    },
    unit: { names: { unitId: 1, lang: 'en', name: 'Piece' }, unitOfMeasurement: 'pcs', content: 1 },
    variation: {
        id: 101,
        name: 'Variation 1',
        availabilityId: 1,
        minimumOrderQuantity: 1,
        mayShowUnitPrice: false,
        availability: {
            id: 1,
            icon: '',
            averageDays: 0,
            createdAt: '',
            updatedAt: '',
            names: { id: 1, availabilityId: 1, lang: 'en', name: 'Available', createdAt: '', updatedAt: '' },
        },
        vatId: 1,
        model: '',
        position: 1,
        intervalOrderQuantity: null,
        releasedAt: undefined,
        availableUntil: undefined,
        bundleType: undefined,
        itemId: 1,
        maximumOrderQuantity: null,
        weightG: undefined,
        weightNetG: undefined,
        widthMM: undefined,
        lengthMM: undefined,
        heightMM: undefined,
        unitsContained: undefined,
        customsTariffNumber: undefined,
        tagsInherited: undefined,
        number: '',
        externalId: null,
        availabilityUpdatedAt: '',
    },
    attributes: [],
    defaultCategories: [],
    barcodes: [],
    groupedAttributes: [],
    hasOrderProperties: false,
    hasRequiredOrderProperty: false,
    tags: [],
    bundleComponents: [],
    variationProperties: [],
    variationAttributeMap: undefined,
    seoSettings: undefined,
    numberOfVariations: undefined,
    canDirectlyAddToCart: 1,
};

export const mockImageGalleryContent = {





}

//   name: string;
//   type: string;
//   content: ImageGalleryContent;
//   configuration?: object;
//   index?: number;
//   meta: {
//     uuid: string;
//   };
//   product?: Product;
// };
export const mockImageGalleryBlock: ImageGalleryProps = {
  name: 'ImageGallery',
  type: 'content',
  content: 
  meta: { uuid: imageGalleryBlockUuid },
  index: 1,

 // content:ImageGalleryContent
  configuration: {
    columnWidths: [6, 6],
  },

  product: mockProduct
};
