import type { BlocksListContribution } from '~/composables/useBlocksList/types';

export default {
  "item-page": {
    "category": "item-page",
    "accessControl": [
      "product"
    ],
    "title": "Item Page",
    "blockName": "ItemPage",
    "variations": [
      {
        "title": "Price Card",
        "image": "https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/item_card.svg",
        "template": {
          "en": {
            "name": "PriceCard",
            "type": "content",
            "meta": {
              "uuid": "a1b2c3d4-e5f6-4789-9a0b-1c2d3e4f5a6b",
              "isGlobalTemplate": false
            },
            "content": {
              "fields": {
                "itemName": true,
                "price": true,
                "tags": true,
                "availability": true,
                "starRating": true,
                "orderProperties": true,
                "variationProperties": true,
                "previewText": true,
                "attributes": true,
                "itemBundle": true,
                "graduatedPrices": true,
                "addToWishlist": true,
                "quantityAndAddToCart": true,
                "itemText": false,
                "technicalData": false
              },
              "fieldsOrder": [
                "itemName",
                "price",
                "tags",
                "availability",
                "starRating",
                "variationProperties",
                "orderProperties",
                "previewText",
                "attributes",
                "itemBundle",
                "graduatedPrices",
                "addToWishlist",
                "quantityAndAddToCart",
                "itemText",
                "technicalData"
              ],
              "fieldsDisabled": [
                "quantityAndAddToCart",
                "price",
                "itemBundle",
                "attributes"
              ],
              "wishlistSize": "small",
              "dropShadow": true,
              "borders": true,
              "borderColor": "#EFF4F1",
              "layout": {
                "paddingTop": 0,
                "paddingBottom": 0,
                "paddingRight": 0,
                "paddingLeft": 0,
                "fullWidth": false
              }
            }
          },
          "de": {
            "name": "PriceCard",
            "type": "content",
            "meta": {
              "uuid": "b1c2d3e4-f5a6-4890-0b1c-2d3e4f5a6b7c",
              "isGlobalTemplate": false
            },
            "content": {
              "fields": {
                "itemName": true,
                "price": true,
                "tags": true,
                "availability": true,
                "starRating": true,
                "orderProperties": true,
                "variationProperties": true,
                "previewText": true,
                "attributes": true,
                "itemBundle": true,
                "graduatedPrices": true,
                "addToWishlist": true,
                "quantityAndAddToCart": true,
                "itemText": false,
                "technicalData": false
              },
              "fieldsOrder": [
                "itemName",
                "price",
                "tags",
                "availability",
                "starRating",
                "variationProperties",
                "orderProperties",
                "previewText",
                "attributes",
                "itemBundle",
                "graduatedPrices",
                "addToWishlist",
                "quantityAndAddToCart",
                "itemText",
                "technicalData"
              ],
              "fieldsDisabled": [
                "quantityAndAddToCart",
                "price",
                "itemBundle",
                "attributes"
              ],
              "wishlistSize": "small",
              "dropShadow": true,
              "borders": true,
              "borderColor": "#EFF4F1",
              "layout": {
                "paddingTop": 0,
                "paddingBottom": 0,
                "paddingRight": 0,
                "paddingLeft": 0,
                "fullWidth": false
              }
            }
          }
        }
      },
      {
        "title": "Image Gallery",
        "image": "https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/preview-thumbs-left.png",
        "template": {
          "en": {
            "name": "ImageGallery",
            "type": "content",
            "meta": {
              "uuid": "c6f1e2d3-4c5a-6c7d-8e9f-0a1b2c3d4e5e",
              "isGlobalTemplate": false
            },
            "parent_slot": 0,
            "content": {
              "thumbnails": {
                "showThumbnails": true,
                "thumbnailType": "left-vertical",
                "enableHoverZoom": true
              }
            }
          },
          "de": {
            "name": "ImageGallery",
            "type": "content",
            "meta": {
              "uuid": "c6f1e2d3-4c5a-6c7d-8e9f-0a1b2c3d4e5e",
              "isGlobalTemplate": false
            },
            "parent_slot": 0,
            "content": {
              "thumbnails": {
                "showThumbnails": true,
                "thumbnailType": "left-vertical",
                "enableHoverZoom": true
              }
            }
          }
        }
      },
      {
        "title": "Item Text",
        "image": "https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/item_text.svg",
        "template": {
          "en": {
            "name": "ItemText",
            "type": "content",
            "meta": {
              "uuid": "c7f1e2d3-4b5a-6c7d-8e9f-0a1b2c3d4e5f",
              "isGlobalTemplate": false
            },
            "parent_slot": 0,
            "content": {
              "text": {
                "title": "Item details"
              },
              "layout": {
                "displayAsCollapsable": true,
                "initiallyCollapsed": true,
                "fullWidth": false,
                "paddingTop": 0,
                "paddingBottom": 0,
                "paddingLeft": 0,
                "paddingRight": 0
              }
            }
          },
          "de": {
            "name": "ItemText",
            "type": "content",
            "meta": {
              "uuid": "d8e2f3a4-5b6c-7d8e-9f0a-1b2c3d4e5f6a",
              "isGlobalTemplate": false
            },
            "parent_slot": 0,
            "content": {
              "text": {
                "title": "Artikeldetails"
              },
              "layout": {
                "displayAsCollapsable": true,
                "initiallyCollapsed": true,
                "fullWidth": false,
                "paddingTop": 0,
                "paddingBottom": 0,
                "paddingLeft": 0,
                "paddingRight": 0
              }
            }
          }
        }
      },
      {
        "title": "Technical Data",
        "image": "https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/technical_data.svg",
        "template": {
          "en": {
            "name": "TechnicalData",
            "type": "content",
            "meta": {
              "uuid": "c7f1e2d3-4b5a-6c7d-8e9f-0a1b2c3d4e5f",
              "isGlobalTemplate": false
            },
            "parent_slot": 0,
            "content": {
              "text": {
                "title": "Technical Data"
              },
              "layout": {
                "displayAsCollapsable": true,
                "initiallyCollapsed": true,
                "fullWidth": false,
                "paddingTop": 0,
                "paddingBottom": 0,
                "paddingLeft": 0,
                "paddingRight": 0
              }
            }
          },
          "de": {
            "name": "TechnicalData",
            "type": "content",
            "meta": {
              "uuid": "d8e2f3a4-5b6c-7d8e-9f0a-1b2c3d4e5f6a",
              "isGlobalTemplate": false
            },
            "parent_slot": 0,
            "content": {
              "text": {
                "title": "Technische Daten"
              },
              "layout": {
                "displayAsCollapsable": true,
                "initiallyCollapsed": true,
                "fullWidth": false,
                "paddingTop": 0,
                "paddingBottom": 0,
                "paddingLeft": 0,
                "paddingRight": 0
              }
            }
          }
        }
      },
      {
        "title": "Customer Reviews",
        "image": "https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/customer_reviews.svg",
        "template": {
          "en": {
            "name": "CustomerReview",
            "type": "content",
            "meta": {
              "uuid": "b7e8f9a1-2c3d-4e5f-9a8b-7c6d5e4f3a2b",
              "isGlobalTemplate": false
            },
            "parent_slot": 0,
            "content": {
              "text": {
                "title": "Customer Reviews"
              },
              "layout": {
                "collapsible": true,
                "initiallyCollapsed": false,
                "fullWidth": false,
                "paddingTop": 0,
                "paddingBottom": 0,
                "paddingLeft": 0,
                "paddingRight": 0
              }
            }
          },
          "de": {
            "name": "CustomerReview",
            "type": "content",
            "meta": {
              "uuid": "f4e3d2c1-b0a9-48f7-8e6d-5c4b3a2f1e0d",
              "isGlobalTemplate": false
            },
            "parent_slot": 0,
            "content": {
              "text": {
                "title": "Kundenrezensionen"
              },
              "layout": {
                "collapsible": true,
                "initiallyCollapsed": false,
                "fullWidth": false,
                "paddingTop": 0,
                "paddingBottom": 0,
                "paddingLeft": 0,
                "paddingRight": 0
              }
            }
          }
        }
      },
      {
        "title": "Legal Information",
        "image": "https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/legal_information.svg",
        "template": {
          "en": {
            "name": "ProductLegalInformation",
            "type": "content",
            "meta": {
              "uuid": "e1b7c9d2-3f4a-4e6b-9c8d-7a5f2e1b3c4d",
              "isGlobalTemplate": false
            },
            "parent_slot": 0,
            "content": {
              "text": {
                "title": "Item legal details",
                "linkText": "EU Responsible Person - click for details"
              },
              "layout": {
                "fullWidth": false,
                "paddingTop": 0,
                "paddingBottom": 0,
                "paddingLeft": 0,
                "paddingRight": 0
              }
            }
          },
          "de": {
            "name": "ProductLegalInformation",
            "type": "content",
            "meta": {
              "uuid": "a9c2e3f4-5b6d-4c7e-8f9a-0b1c2d3e4f5a",
              "isGlobalTemplate": false
            },
            "parent_slot": 0,
            "content": {
              "text": {
                "title": "Rechtliche Angaben zum Artikel",
                "linkText": "EU-Verantwortlicher – hier klicken für Details"
              },
              "layout": {
                "fullWidth": false,
                "paddingTop": 0,
                "paddingBottom": 0,
                "paddingLeft": 0,
                "paddingRight": 0
              }
            }
          }
        }
      },
      {
        "title": "More details",
        "image": "https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/Item_data_updated.svg",
        "template": {
          "en": {
            "name": "ItemData",
            "type": "content",
            "meta": {
              "uuid": "e1b7c9d2-3f4a-4e6b-9c8d-7a5f2e1b3cfd",
              "isGlobalTemplate": false
            },
            "parent_slot": 0,
            "content": {
              "text": {
                "title": "More details"
              },
              "fields": {
                "itemId": true,
                "condition": true,
                "ageRating": true,
                "externalVariationId": true,
                "model": true,
                "manufacturer": true,
                "manufacturingCountry": true,
                "content": true,
                "grossWeight": true,
                "netWeight": true,
                "dimensions": true,
                "customTariffNumber": true,
                "properties": true
              },
              "fieldsOrder": [
                "itemId",
                "condition",
                "ageRating",
                "externalVariationId",
                "model",
                "manufacturer",
                "manufacturingCountry",
                "content",
                "grossWeight",
                "netWeight",
                "dimensions",
                "customTariffNumber",
                "properties"
              ],
              "layout": {
                "paddingTop": 0,
                "paddingBottom": 0,
                "paddingRight": 0,
                "paddingLeft": 0,
                "displayAsCollapsable": false,
                "initiallyCollapsed": false
              }
            }
          },
          "de": {
            "name": "ItemData",
            "type": "content",
            "meta": {
              "uuid": "a9c2e3f4-5b6d-4c7e-8f9a-0b1c2d3e4t5a",
              "isGlobalTemplate": false
            },
            "parent_slot": 0,
            "content": {
              "text": {
                "title": "Weitere Details"
              },
              "fields": {
                "itemId": true,
                "condition": true,
                "ageRating": true,
                "externalVariationId": true,
                "model": true,
                "manufacturer": true,
                "manufacturingCountry": true,
                "content": true,
                "grossWeight": true,
                "netWeight": true,
                "dimensions": true,
                "customTariffNumber": true,
                "properties": true
              },
              "fieldsOrder": [
                "itemId",
                "condition",
                "ageRating",
                "externalVariationId",
                "model",
                "manufacturer",
                "manufacturingCountry",
                "content",
                "grossWeight",
                "netWeight",
                "dimensions",
                "customTariffNumber",
                "properties"
              ],
              "layout": {
                "paddingTop": 0,
                "paddingBottom": 0,
                "paddingRight": 0,
                "paddingLeft": 0,
                "displayAsCollapsable": false,
                "initiallyCollapsed": false
              }
            }
          }
        }
      }
    ]
  },
} satisfies BlocksListContribution;
