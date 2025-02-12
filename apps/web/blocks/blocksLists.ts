/* eslint-disable max-lines */

import type { BlocksList } from '~/components/BlocksNavigationList/types';

export const blocksLists: BlocksList = {
  'image-banner': {
    category: 'image-banner',
    title: 'Image Banner',
    blockName: 'BannerCarousel',
    variations: [
      {
        title: 'Image Banner Left',
        image: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/image_banner_left.png',
        template: {
          en: {
            name: 'BannerCarousel',
            options: {
              controls: {
                color: '#000',
              },
              bannerItems: [
                {
                  image: {
                    wideScreen: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    desktop: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    tablet: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    mobile: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    alt: '',
                    brightness: 0.5,
                  },
                  text: {
                    color: '#000',
                    bgcolor: '#fff',
                    bgopacity: 0.9,
                    pretitle: 'Pretitle',
                    title: 'h1 heading',
                    htmlDescription: 'Text that supports HTML formatting',
                    textAlignment: 'left',
                    justify: 'top',
                    align: 'left',
                  },
                  button: {
                    label: 'Button',
                    link: '/',
                    variant: 'primary',
                  },
                },
                {
                  image: {
                    wideScreen: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    desktop: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    tablet: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    mobile: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    alt: '',
                    brightness: 0.75,
                  },
                  text: {
                    color: '#000',
                    bgcolor: '#fff',
                    bgopacity: 1,
                    pretitle: 'Pretitle',
                    title: 'h1 heading',
                    htmlDescription: 'Text that supports HTML formatting',
                    textAlignment: 'left',
                    justify: 'top',
                    align: 'left',
                  },
                  button: {
                    label: 'Button',
                    link: '/',
                    variant: 'primary',
                  },
                },
              ],
            },
          },

          de: {
            name: 'BannerCarousel',
            options: {
              controls: {
                color: '#000',
              },
              bannerItems: [
                {
                  image: {
                    wideScreen: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    desktop: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    tablet: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    mobile: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    alt: '',
                    brightness: 0.5,
                  },
                  text: {
                    color: '#000',
                    bgcolor: '#fff',
                    bgopacity: 0.9,
                    pretitle: 'Vortitel',
                    title: 'h1 Titel',
                    subtitle: 'Untertitel',
                    htmlDescription: 'Text mit HTML-Formatierung',
                    textAlignment: 'left',
                    justify: 'top',
                    align: 'left',
                  },
                  button: {
                    label: 'Button',
                    link: '/',
                    variant: 'primary',
                  },
                },
                {
                  image: {
                    wideScreen: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    desktop: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    tablet: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    mobile: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    alt: '',
                    brightness: 0.75,
                  },
                  text: {
                    color: '#000',
                    bgcolor: '#fff',
                    bgopacity: 1,
                    pretitle: 'Vortitel',
                    title: 'h1 Titel',
                    htmlDescription: 'Text mit HTML-Formatierung',
                    textAlignment: 'left',
                    justify: 'top',
                    align: 'left',
                  },
                  button: {
                    label: 'Button',
                    link: '/',
                    variant: 'primary',
                  },
                },
              ],
            },
          },
        },
      },
      {
        title: 'Image Banner Right',
        image: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/image_banner_right.png',
        template: {
          en: {
            name: 'BannerCarousel',
            options: {
              controls: {
                color: '#000',
              },
              bannerItems: [
                {
                  image: {
                    wideScreen: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    desktop: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    tablet: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    mobile: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    alt: '',
                    brightness: 0.5,
                  },
                  text: {
                    color: '#000',
                    bgcolor: '#fff',
                    bgopacity: 0.9,
                    pretitle: 'Pretitle',
                    title: 'h1 heading',
                    htmlDescription: 'Text that supports HTML formatting',
                    textAlignment: 'left',
                    justify: 'bottom',
                    align: 'right',
                  },
                  button: {
                    label: 'Button',
                    link: '/',
                    variant: 'primary',
                  },
                },
                {
                  image: {
                    wideScreen: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    desktop: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    tablet: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    mobile: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    alt: '',
                    brightness: 0.75,
                  },
                  text: {
                    color: '#000',
                    bgcolor: '#fff',
                    bgopacity: 1,
                    pretitle: 'Pretitle',
                    title: 'h1 heading',
                    htmlDescription: 'Text that supports HTML formatting',
                    textAlignment: 'left',
                    justify: 'bottom',
                    align: 'right',
                  },
                  button: {
                    label: 'Button',
                    link: '/',
                    variant: 'primary',
                  },
                },
              ],
            },
          },

          de: {
            name: 'BannerCarousel',
            options: {
              controls: {
                color: '#000',
              },
              bannerItems: [
                {
                  image: {
                    wideScreen: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    desktop: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    tablet: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    mobile: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    alt: '',
                    brightness: 0.5,
                  },
                  text: {
                    color: '#000',
                    bgcolor: '#fff',
                    bgopacity: 0.9,
                    pretitle: 'Vortitel',
                    title: 'h1 Titel',
                    subtitle: 'Untertitel',
                    htmlDescription: 'Text mit HTML-Formatierung',
                    textAlignment: 'left',
                    justify: 'top',
                    align: 'left',
                  },
                  button: {
                    label: 'Button',
                    link: '/',
                    variant: 'primary',
                  },
                },
                {
                  image: {
                    wideScreen: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    desktop: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    tablet: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    mobile: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    alt: '',
                    brightness: 0.75,
                  },
                  text: {
                    color: '#000',
                    bgcolor: '#fff',
                    bgopacity: 1,
                    pretitle: 'Vortitel',
                    title: 'h1 Titel',
                    htmlDescription: 'Text mit HTML-Formatierung',
                    textAlignment: 'left',
                    justify: 'top',
                    align: 'left',
                  },
                  button: {
                    label: 'Button',
                    link: '/',
                    variant: 'primary',
                  },
                },
              ],
            },
          },
        },
      },
      {
        title: 'Image Banner Center',
        image: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/image_banner_center.png',
        template: {
          en: {
            name: 'BannerCarousel',
            options: {
              controls: {
                color: '#000',
              },
              bannerItems: [
                {
                  image: {
                    wideScreen: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    desktop: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    tablet: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    mobile: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    alt: '',
                    brightness: 0.5,
                  },
                  text: {
                    color: '#000',
                    bgcolor: '#fff',
                    bgopacity: 0.9,
                    pretitle: 'Pretitle',
                    title: 'h1 heading',
                    htmlDescription: 'Text that supports HTML formatting',
                    textAlignment: 'left',
                    justify: 'top',
                    align: 'center',
                  },
                  button: {
                    label: 'Button',
                    link: '/',
                    variant: 'primary',
                  },
                },
                {
                  image: {
                    wideScreen: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    desktop: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    tablet: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    mobile: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    alt: '',
                    brightness: 0.75,
                  },
                  text: {
                    color: '#000',
                    bgcolor: '#fff',
                    bgopacity: 1,
                    pretitle: 'Pretitle',
                    title: 'h1 title',
                    htmlDescription: 'Text that supports HTML formatting',
                    textAlignment: 'left',
                    justify: 'top',
                    align: 'center',
                  },
                  button: {
                    label: 'Button',
                    link: '/',
                    variant: 'primary',
                  },
                },
              ],
            },
          },

          de: {
            name: 'BannerCarousel',
            options: {
              controls: {
                color: '#000',
              },
              bannerItems: [
                {
                  image: {
                    wideScreen: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    desktop: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    tablet: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    mobile: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    alt: '',
                    brightness: 0.5,
                  },
                  text: {
                    color: '#000',
                    bgcolor: '#fff',
                    bgopacity: 0.9,
                    pretitle: 'Vortitel',
                    title: 'h1 Titel',
                    subtitle: 'Untertitel',
                    htmlDescription: 'Text mit HTML-Formatierung',
                    textAlignment: 'left',
                    justify: 'top',
                    align: 'center',
                  },
                  button: {
                    label: 'Button',
                    link: '/',
                    variant: 'primary',
                  },
                },
                {
                  image: {
                    wideScreen: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    desktop: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    tablet: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    mobile: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    alt: '',
                    brightness: 0.75,
                  },
                  text: {
                    color: '#000',
                    bgcolor: '#fff',
                    bgopacity: 1,
                    pretitle: 'Vortitel',
                    title: 'h1 Titel',
                    htmlDescription: 'Text mit HTML-Formatierung',
                    textAlignment: 'left',
                    justify: 'top',
                    align: 'center',
                  },
                  button: {
                    label: 'Button',
                    link: '/',
                    variant: 'primary',
                  },
                },
              ],
            },
          },
        },
      },
    ],
  },
  'image-with-text': {
    category: 'image-with-text',
    title: 'Image with Text',
    blockName: 'ImageText',
    variations: [
      {
        title: 'Image Right Text',
        image: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/image_right_text.png',
        template: {
          en: {
            name: 'ImageText',
            options: {
              text: {
                htmlDescription: 'Text that supports HTML formatting',
                title: 'h2 heading',
                subtitle: 'subtitle',
                textAlignment: 'left',
                color: '#000',
              },
              button: {
                label: 'Button',
                link: '/',
                variant: 'primary',
              },
              image: {
                wideScreen: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                desktop: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                tablet: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                mobile: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                alt: 'alt text',
                imageAlignment: 'right',
              },
            },
          },

          de: {
            name: 'ImageText',
            options: {
              text: {
                htmlDescription: 'Text mit HTML-Formatierung',
                title: 'h2 Titel',
                subtitle: 'Untertitel',
                textAlignment: 'right',
                color: '#000',
              },
              button: {
                label: 'Button',
                link: '/',
                variant: 'primary',
              },
              image: {
                wideScreen: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                desktop: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                tablet: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                mobile: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                alt: 'alt text',
                imageAlignment: 'left',
              },
            },
          },
        },
      },
      {
        title: 'Image Left Text',
        image: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/image_left_text.png',
        template: {
          en: {
            name: 'ImageText',
            options: {
              text: {
                htmlDescription: 'Text that supports HTML formatting',
                title: 'h2 heading',
                subtitle: 'Subtitle',
                textAlignment: 'right',
                color: '#000',
              },
              button: {
                label: 'Button',
                link: '/',
                variant: 'primary',
              },
              image: {
                wideScreen: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                desktop: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                tablet: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                mobile: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                alt: 'Headphones',
                imageAlignment: 'left',
              },
            },
          },

          de: {
            name: 'ImageText',
            options: {
              text: {
                htmlDescription: 'Text mit HTML-Formatierung',
                title: 'h2 Titel',
                subtitle: 'Untertitel',
                textAlignment: 'left',
                color: '#000',
              },
              button: {
                label: 'Button',
                link: '/',
                variant: 'primary',
              },
              image: {
                wideScreen: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                desktop: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                tablet: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                mobile: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                alt: 'Headphones',
                imageAlignment: 'left',
              },
            },
          },
        },
      },
    ],
  },
  'rich-text': {
    category: 'rich-text',
    title: 'Rich Text',
    blockName: 'TextCard',
    variations: [
      {
        title: 'Rich Text',
        image: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/rich_text.png',
        template: {
          en: {
            name: 'TextCard',
            options: {
              text: {
                htmlDescription: 'Text that supports HTML formatting',
                pretitle: 'Pretitle',
                title: 'h2 heading',
                subtitle: 'Subtitle',
                textAlignment: 'center',
                color: '#000',
              },
              button: {
                buttonText: 'Button',
                link: '/',
                variant: 'primary',
              },
            },
          },
          de: {
            name: 'TextCard',
            options: {
              text: {
                htmlDescription: 'Text mit HTML-Formatierung',
                pretitle: 'Vortitel',
                title: 'h2 Titel',
                subtitle: 'Untertitel',
                textAlignment: 'center',
                color: '#000',
              },
              button: {
                buttonText: 'Buttom',
                link: '/',
                variant: 'primary',
              },
            },
          },
        },
      },
    ],
  },
  'product-galleries': {
    category: 'product-galleries',
    title: 'Products',
    blockName: 'ProductRecommendedProducts',
    variations: [
      {
        title: 'Product Galleries',
        image: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/product_galleries.png',
        template: {
          en: {
            name: 'ProductRecommendedProducts',
            options: {
              text: {
                pretitle: 'Pretitle',
                title: 'h2 heading',
                subtitle: 'Subtitle.',
                htmlDescription: 'Text that supports HTML formatting',
              },
              categoryId: '49',
            },
          },
          de: {
            name: 'ProductRecommendedProducts',
            options: {
              text: {
                pretitle: 'Vortitel',
                title: 'h2 Titel',
                subtitle: 'Untertitel',
                htmlDescription: 'Text mit HTML-Formatierung',
              },
              categoryId: '49',
            },
          },
        },
      },
    ],
  },
  forms: {
    category: 'forms',
    title: 'Forms',
    blockName: 'NewsletterSubscribe',
    variations: [
      {
        title: 'Forms Preview',
        image: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/forms_preview.png',
        template: {
          en: {
            name: 'NewsletterSubscribe',
            options: {
              text: {
                bgColor: '#f5f5f5',
                title: 'h2 heading',
                htmlDescription: 'Text that supports HTML formatting',
              },
              input: {
                displayNameInput: false,
                nameIsRequired: false,
              },
              button: {
                label: 'Button',
              },
            },
          },

          de: {
            name: 'NewsletterSubscribe',
            options: {
              text: {
                bgColor: '#f5f5f5',
                title: 'h2 Titel',
                htmlDescription: 'Text mit HTML-Formatierung',
              },
              input: {
                displayNameInput: false,
                nameIsRequired: false,
              },
              button: {
                label: 'Button',
              },
            },
          },
        },
      },
    ],
  },
};
