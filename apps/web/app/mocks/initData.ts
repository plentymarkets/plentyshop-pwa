import type { Cart, CategoryTreeItem, RobotsStaticPages, Setting } from '@plentymarkets/shop-api';

export const mockCart: Cart = {
  sessionId: 'mock-session',
  orderId: null,
  customerId: null,
  customerShippingAddressId: null,
  currency: 'EUR',
  referrerId: 1,
  shippingCountryId: 1,
  methodOfPaymentId: 1,
  shippingProviderId: 1,
  shippingProfileId: 1,
  itemSum: 0,
  itemSumNet: 0,
  basketAmount: 0,
  basketAmountNet: 0,
  shippingAmount: 0,
  shippingAmountNet: 0,
  paymentAmount: 0,
  couponCode: '',
  couponDiscount: 0,
  shippingDeleteByCoupon: false,
  basketRebate: 0,
  basketRebateType: 0,
  maxDeliveryDays: {},
};

export const mockCategoryTree: CategoryTreeItem[] = [
  {
    id: 1,
    type: 'item',
    right: 'all',
    childCount: 2,
    itemCount: [],
    details: [
      {
        name: 'Living Room',
        lang: 'en',
        nameUrl: 'living-room',
        metaTitle: 'Living Room',
        imagePath: null,
        image2Path: null,
      },
      {
        name: 'Wohnzimmer',
        lang: 'de',
        nameUrl: 'wohnzimmer',
        metaTitle: 'Wohnzimmer',
        imagePath: null,
        image2Path: null,
      },
    ],
    children: [
      {
        id: 11,
        type: 'item',
        right: 'all',
        childCount: 0,
        itemCount: [],
        details: [
          { name: 'Sofas', lang: 'en', nameUrl: 'sofas', metaTitle: 'Sofas', imagePath: null, image2Path: null },
          { name: 'Sofas', lang: 'de', nameUrl: 'sofas', metaTitle: 'Sofas', imagePath: null, image2Path: null },
        ],
      },
      {
        id: 12,
        type: 'item',
        right: 'all',
        childCount: 0,
        itemCount: [],
        details: [
          {
            name: 'Armchairs',
            lang: 'en',
            nameUrl: 'armchairs',
            metaTitle: 'Armchairs',
            imagePath: null,
            image2Path: null,
          },
          { name: 'Sessel', lang: 'de', nameUrl: 'sessel', metaTitle: 'Sessel', imagePath: null, image2Path: null },
        ],
      },
    ],
  },
  {
    id: 2,
    type: 'item',
    right: 'all',
    childCount: 2,
    itemCount: [],
    details: [
      { name: 'Bedroom', lang: 'en', nameUrl: 'bedroom', metaTitle: 'Bedroom', imagePath: null, image2Path: null },
      {
        name: 'Schlafzimmer',
        lang: 'de',
        nameUrl: 'schlafzimmer',
        metaTitle: 'Schlafzimmer',
        imagePath: null,
        image2Path: null,
      },
    ],
    children: [
      {
        id: 21,
        type: 'item',
        right: 'all',
        childCount: 0,
        itemCount: [],
        details: [
          { name: 'Beds', lang: 'en', nameUrl: 'beds', metaTitle: 'Beds', imagePath: null, image2Path: null },
          { name: 'Betten', lang: 'de', nameUrl: 'betten', metaTitle: 'Betten', imagePath: null, image2Path: null },
        ],
      },
      {
        id: 22,
        type: 'item',
        right: 'all',
        childCount: 0,
        itemCount: [],
        details: [
          {
            name: 'Wardrobes',
            lang: 'en',
            nameUrl: 'wardrobes',
            metaTitle: 'Wardrobes',
            imagePath: null,
            image2Path: null,
          },
          {
            name: 'Kleiderschränke',
            lang: 'de',
            nameUrl: 'kleiderschraenke',
            metaTitle: 'Kleiderschränke',
            imagePath: null,
            image2Path: null,
          },
        ],
      },
    ],
  },
  {
    id: 3,
    type: 'item',
    right: 'all',
    childCount: 0,
    itemCount: [],
    details: [
      { name: 'Sale', lang: 'en', nameUrl: 'sale', metaTitle: 'Sale', imagePath: null, image2Path: null },
      { name: 'Sale', lang: 'de', nameUrl: 'sale', metaTitle: 'Sale', imagePath: null, image2Path: null },
    ],
  },
];

export const mockRobots: RobotsStaticPages = {
  robotsHomepage: 'ALL',
  robotsContactPage: 'ALL',
  robotsCancellationRights: 'ALL',
  robotsCancellationForm: 'ALL',
  robotsLegalDisclosure: 'ALL',
  robotsPrivacyPolicy: 'ALL',
  robotsTermsAndConditions: 'ALL',
  robotsSearchResult: 'NOINDEX',
  robotsAccessibilityDeclarationResult: 'ALL',
};

export const mockSettings: Setting[] = [
  { key: 'favicon', originalKey: 'favicon', value: '/_nuxt-plenty/favicon.ico' },
  { key: 'ogTitle', originalKey: 'ogTitle', value: 'PlentyONE Shop' },
  { key: 'ogImage', originalKey: 'ogImage', value: null },
  { key: 'metaDescription', originalKey: 'metaDescription', value: 'PlentyONE Shop' },
  { key: 'logoUrl', originalKey: 'logoUrl', value: '/_nuxt-plenty/images/logo.png' },
  { key: 'storeName', originalKey: 'storeName', value: 'PlentyONE Shop' },
  { key: 'useAvif', originalKey: 'useAvif', value: 'false' },
  { key: 'useWebp', originalKey: 'useWebp', value: 'true' },
];
