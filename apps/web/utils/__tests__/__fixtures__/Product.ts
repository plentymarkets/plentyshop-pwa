import type { Product } from "@plentymarkets/shop-api";

export const ProductFixture: Product = {
  defaultCategories: [
    {
      id: 73,
      parentCategoryId: null,
      level: 1,
      type: 'item',
      linklist: true,
      right: 'all',
      sitemap: true,
      updatedAt: '2024-01-01T00:00:00+02:00',
      manually: true,
      plentyId: 60796
    }
  ],
  filter: {
    hasManufacturer: false,
    isSalable: true,
    isSalableAndActive: true,
    hasActiveChildren: false
  },
  images: {
    all: [
      {
        path: 'S3:157:gear-headphones-01.png',
        names: [],
        position: 0,
        url: 'https://cdn02.plentymarkets.com/mevofvd5omld/item/images/157/full/gear-headphones-01.png',
        urlSecondPreview: 'https://cdn02.plentymarkets.com/mevofvd5omld/item/images/157/secondPreview/gear-headphones-01.png',
        urlPreview: 'https://cdn02.plentymarkets.com/mevofvd5omld/item/images/157/preview/gear-headphones-01.png',
        urlMiddle: 'https://cdn02.plentymarkets.com/mevofvd5omld/item/images/157/middle/gear-headphones-01.png',
        cleanImageName: 'gear-headphones-01.png',
        height: 1430,
        width: 1430
      }
    ],
    variation: []
  },
  item: {
    id: 157,
    add_cms_page: '0',
    condition: {
      id: 0,
      names: {
        lang: 'en',
        name: 'New'
      }
    },
    storeSpecial: null,
    manufacturerId: 0,
    producingCountryId: 1,
    revenueAccount: 0,
    conditionApi: {
      id: 0,
      names: {
        lang: 'en',
        name: 'New'
      }
    },
    ageRestriction: 0,
    itemType: 'default',
    producingCountry: {
      storehouseId: 0,
      names: {
        name: 'Germany',
        lang: 'en'
      },
      lang: 'de',
      shippingDestinationId: 101,
      id: 1,
      isoCode3: 'DEU',
      isCountryStateMandatory: null,
      isoCode2: 'DE',
      name: 'Germany',
      active: 1
    },
    manufacturer: [],
    rebate: 0,
    salableVariationCount: 1,
    customsTariffNumber: ''
  },
  variation: {
    position: 1,
    number: '1145',
    model: '',
    externalId: '',
    availabilityId: 1,
    maximumOrderQuantity: null,
    minimumOrderQuantity: 1,
    intervalOrderQuantity: 1,
    availableUntil: null,
    releasedAt: null,
    name: '',
    weightG: 0,
    weightNetG: 0,
    widthMM: 0,
    lengthMM: 0,
    heightMM: 0,
    unitsContained: 51,
    vatId: 0,
    bundleType: null,
    mayShowUnitPrice: true,
    customsTariffNumber: '',
    availability: {
      id: 1,
      icon: 'av1.gif',
      averageDays: 2,
      createdAt: '2022-06-27 09:20:16',
      updatedAt: '2022-06-27 09:20:16',
      names: {
        id: 42,
        availabilityId: 1,
        lang: 'en',
        name: 'Ready for shipping, delivery in 48h',
        createdAt: '2022-06-27 09:20:16',
        updatedAt: '2022-06-27 09:20:16'
      },
      iconPath: '/tpl/availability/av1.gif'
    },
    id: 1100,
    unitCombinationId: 9,
    availabilityUpdatedAt: '2022-02-15T16:56:01+01:00'
  },
  texts: {
    name2: '',
    id: 258,
    description: '<h2 class="mb-4">Our most elegant piece</h2> <p>Crafted from a blend of organic pineapple peels and eucalyptus fibers this item resembles the most sustainable and yet elegant component in our collection. It comes in three different colors that were inspired by the Mongolian landscapes. Charcoal, Sand and Berry Red.&nbsp;</p> <div class="d-flex align-items-center justify-content-between py-4 px-0 px-md-4"><div class="d-inline-block text-center"><span class="fa-3x">&nbsp;</span> <div class="fa fa-3x fa-tree mb-2">&nbsp;</div> <p>Sustainable</p></div> <div class="d-inline-block text-center"><span class="fa-3x">&nbsp;</span> <div class="fa fa-3x fa-heart mb-2">&nbsp;</div> <p>Hand-crafted</p></div> <div class="d-inline-block text-center"><span class="fa-3x">&nbsp;</span> <div class="fa fa-3x fa-flask mb-2">&nbsp;</div> <p>Material science</p></div></div> <p class="mb-4"><img alt="Hand-crafted with love" src="https://cdn15.plentymarkets.com/ksvjcz2xpb12/frontend/story-handcrafted-1920x.jpg" ></p> <p>Every thread and every fibre is carefully manufactured in our local facilities. In addition, each piece goes through our strict quality assurance processes, so that you can enjoy flawless products, every time.</p>',
    itemId: 157,
    name3: '',
    lang: 'en',
    metaDescription: '',
    urlPath: 'headphones-capybara',
    technicalData: '<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. &nbsp;&nbsp;</p> <p>Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. &nbsp;&nbsp;</p> <p>Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. &nbsp;&nbsp;</p> <p>Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. &nbsp;&nbsp;</p> <p>Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis. &nbsp;&nbsp;</p> <p>At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur</p>',
    name1: 'Headphones Capybara',
    shortDescription: '',
    keywords: ''
  },
  unit: {
    names: {
      unitId: 5,
      lang: 'en',
      name: 'liter'
    },
    unitOfMeasurement: 'LTR',
    content: 2
  },
  properties: [],
  hasOrderProperties: false,
  hasRequiredOrderProperty: false,
  facets: [],
  variationAttributeMap: {
    variations: [
      {
        variationId: 1100,
        isSalable: true,
        unitCombinationId: 9,
        unitId: 5,
        unitName: '2 liter',
        attributes: []
      }
    ],
    attributes: [
      {
        attributeId: 1,
        position: 1,
        name: '',
        type: '',
        values: [
          {
            attributeValueId: 1,
            position: 1,
            name: '',
            imageUrl: '',
          }
        ]
      }
    ]
  }
};

export default ProductFixture;
