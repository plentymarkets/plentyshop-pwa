// Category will be used to sort at the next step
// We can also add description if we need to add toltips or stuff like that
// We could also send configuration here --- that will be the JSON
export const blocksLists = {
  'image-banner': {
    category: 'image-banner',
    title: 'Image Banner',
    variations: [
      {
        title: 'Image Banner Left',
        image: '/images/blocks/image_banner_left.png',
      },
      {
        title: 'Image Banner Right',
        image: '/images/blocks/image_banner_right.png',
      },
      {
        title: 'Image Banner Center',
        image: '/images/blocks/image_banner_center.png',
      },
    ],
  },
  'image-with-text': {
    category: 'image-with-text',
    title: 'Image with Text',
    variations: [
      {
        title: 'Image Right Text',
        image: '/images/blocks/image_right_text.png',
      },
      {
        title: 'Image Left Text',
        image: '/images/blocks/image_left_text.png',
      },
    ],
  },
  'rich-text': {
    category: 'rich-text',
    title: 'Rich Text',
    variations: [
      {
        title: 'Rich Text',
        image: '/images/blocks/rich_text.png',
      },
    ],
  },
  'product-galleries': {
    category: 'product-galleries',
    title: 'Products',
    variations: [
      {
        title: 'Product Galleries',
        image: '/images/blocks/product_galleries.png',
      },
    ],
  },
  forms: {
    category: 'forms',
    title: 'Forms',
    variations: [
      {
        title: 'Forms Preview',
        image: '/images/blocks/forms_preview.png',
      },
    ],
  },
};
