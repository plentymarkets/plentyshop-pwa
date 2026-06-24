/* eslint-disable max-lines */
import type { BlocksList } from '~/composables/useBlocksList/types';

const blocksList = {
  'image-banner': {
    category: 'image-banner',
    accessControl: ['content', 'productCategory', 'product'],
    title: 'Image Banner',
    blockName: 'BannerCarousel',
    variations: [
      {
        title: 'Image Banner Left',
        image: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/image_banner_left.png',
        template: {
          en: {
            name: 'Carousel',
            type: 'structure',
            meta: {
              uuid: '11111111-1111-4111-8111-111111111111',
            },
            configuration: {
              controls: {
                color: '#000',
              },
              layout: {
                fullWidth: true,
              },
            },
            content: [
              {
                name: 'Banner',
                type: 'content',
                meta: {
                  uuid: '22222222-2222-4222-8222-222222222222',
                },
                content: {
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
                    subtitle: 'Subtitle',
                    htmlDescription: '<p style="text-align: left;">Text that supports HTML formatting</p>',
                    justify: 'top',
                    align: 'left',
                    background: true,
                  },
                  button: {
                    label: 'Button',
                    link: '/',
                    variant: 'primary',
                    alignment: 'left',
                  },
                },
              },
              {
                name: 'Banner',
                type: 'content',
                meta: {
                  uuid: '33333333-3333-4333-8333-333333333333',
                },
                content: {
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
                    subtitle: 'Subtitle',
                    htmlDescription: '<p style="text-align: left;">Text that supports HTML formatting</p>',
                    justify: 'top',
                    align: 'left',
                    background: true,
                  },
                  button: {
                    label: 'Button',
                    link: '/',
                    variant: 'primary',
                    alignment: 'left',
                  },
                },
              },
            ],
          },
          de: {
            name: 'Carousel',
            type: 'structure',
            meta: {
              uuid: '44444444-4444-4444-8444-444444444444',
            },
            configuration: {
              controls: {
                color: '#000',
              },
              layout: {
                fullWidth: true,
              },
            },
            content: [
              {
                name: 'Banner',
                type: 'content',
                meta: {
                  uuid: '55555555-5555-4555-8555-555555555555',
                },
                content: {
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
                    htmlDescription: '<p style="text-align: left;">Text mit HTML-Formatierung</p>',
                    justify: 'top',
                    align: 'left',
                    background: true,
                  },
                  button: {
                    label: 'Button',
                    link: '/',
                    variant: 'primary',
                    alignment: 'left',
                  },
                },
              },
              {
                name: 'Banner',
                type: 'content',
                meta: {
                  uuid: '66666666-6666-4666-8666-666666666666',
                },
                content: {
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
                    subtitle: 'Untertitel',
                    htmlDescription: '<p style="text-align: left;">Text mit HTML-Formatierung</p>',
                    justify: 'top',
                    align: 'left',
                    background: true,
                  },
                  button: {
                    label: 'Button',
                    link: '/',
                    variant: 'primary',
                    alignment: 'left',
                  },
                },
              },
            ],
          },
        },
      },
      {
        title: 'Image Banner Right',
        image: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/image_banner_right.png',
        template: {
          en: {
            name: 'Carousel',
            type: 'structure',
            meta: {
              uuid: '77777777-7777-4777-8777-777777777777',
            },
            configuration: {
              controls: {
                color: '#000',
              },
              layout: {
                fullWidth: true,
              },
            },
            content: [
              {
                name: 'Banner',
                type: 'content',
                meta: {
                  uuid: '88888888-8888-4888-8888-888888888888',
                },
                content: {
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
                    subtitle: 'Subtitle',
                    htmlDescription: '<p style="text-align: left;">Text that supports HTML formatting</p>',
                    justify: 'top',
                    align: 'right',
                  },
                  button: {
                    label: 'Button',
                    link: '/',
                    variant: 'primary',
                    alignment: 'left',
                  },
                },
              },
              {
                name: 'Banner',
                type: 'content',
                meta: {
                  uuid: '99999999-9999-4999-8999-999999999999',
                },
                content: {
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
                    subtitle: 'Subtitle',
                    htmlDescription: '<p style="text-align: left;">Text that supports HTML formatting</p>',
                    justify: 'top',
                    align: 'right',
                  },
                  button: {
                    label: 'Button',
                    link: '/',
                    variant: 'primary',
                    alignment: 'left',
                  },
                },
              },
            ],
          },
          de: {
            name: 'Carousel',
            type: 'structure',
            meta: {
              uuid: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
            },
            configuration: {
              controls: {
                color: '#000',
              },
              layout: {
                fullWidth: true,
              },
            },
            content: [
              {
                name: 'Banner',
                type: 'content',
                meta: {
                  uuid: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
                },
                content: {
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
                    htmlDescription: '<p style="text-align: left;">Text mit HTML-Formatierung</p>',
                    justify: 'top',
                    align: 'right',
                  },
                  button: {
                    label: 'Button',
                    link: '/',
                    variant: 'primary',
                    alignment: 'left',
                  },
                },
              },
              {
                name: 'Banner',
                type: 'content',
                meta: {
                  uuid: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
                },
                content: {
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
                    subtitle: 'Untertitel',
                    htmlDescription: '<p style="text-align: left;">Text mit HTML-Formatierung</p>',
                    justify: 'top',
                    align: 'left',
                  },
                  button: {
                    label: 'Button',
                    link: '/',
                    variant: 'primary',
                    alignment: 'left',
                  },
                },
              },
            ],
          },
        },
      },
      {
        title: 'Image Banner Center',
        image: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/image_banner_center.png',
        template: {
          en: {
            name: 'Carousel',
            type: 'structure',
            meta: {
              uuid: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
            },
            configuration: {
              controls: {
                color: '#000',
              },
              layout: {
                fullWidth: true,
              },
            },
            content: [
              {
                name: 'Banner',
                type: 'content',
                meta: {
                  uuid: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
                },
                content: {
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
                    subtitle: 'Subtitle',
                    htmlDescription: '<p style="text-align: left;">Text that supports HTML formatting</p>',
                    justify: 'top',
                    align: 'center',
                  },
                  button: {
                    label: 'Button',
                    link: '/',
                    variant: 'primary',
                    alignment: 'left',
                  },
                },
              },
              {
                name: 'Banner',
                type: 'content',
                meta: {
                  uuid: 'ffffffff-ffff-4fff-8fff-ffffffffffff',
                },
                content: {
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
                    subtitle: 'Subtitle',
                    htmlDescription: '<p style="text-align: left;">Text that supports HTML formatting</p>',
                    justify: 'top',
                    align: 'center',
                  },
                  button: {
                    label: 'Button',
                    link: '/',
                    variant: 'primary',
                    alignment: 'left',
                  },
                },
              },
            ],
          },
          de: {
            name: 'Carousel',
            type: 'structure',
            meta: {
              uuid: '01010101-0101-4011-8011-010101010101',
            },
            configuration: {
              controls: {
                color: '#000',
              },
              layout: {
                fullWidth: true,
              },
            },
            content: [
              {
                name: 'Banner',
                type: 'content',
                meta: {
                  uuid: '12121212-1212-4121-8121-121212121212',
                },
                content: {
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
                    htmlDescription: '<p style="text-align: left;">Text mit HTML-Formatierung</p>',
                    justify: 'top',
                    align: 'center',
                  },
                  button: {
                    label: 'Button',
                    link: '/',
                    variant: 'primary',
                    alignment: 'left',
                  },
                },
              },
              {
                name: 'Banner',
                type: 'content',
                meta: {
                  uuid: '23232323-2323-4232-8232-232323232323',
                },
                content: {
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
                    subtitle: 'Untertitel',
                    htmlDescription: '<p style="text-align: left;">Text mit HTML-Formatierung</p>',
                    justify: 'top',
                    align: 'center',
                  },
                  button: {
                    label: 'Button',
                    link: '/',
                    variant: 'primary',
                    alignment: 'left',
                  },
                },
              },
            ],
          },
        },
      },
    ],
  },
};

export const getBlocksList = (): BlocksList => blocksList as unknown as BlocksList;
