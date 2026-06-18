import type { BlocksListContribution } from '~/composables/useBlocksList/types';

export default {
  image: {
    category: 'image',
    accessControl: ['content', 'productCategory', 'product'],
    title: 'Image',
    blockName: 'Image',
    variations: [
      {
        title: 'Image',
        image: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/image_preview.png',
        template: {
          en: {
            name: 'Image',
            type: 'content',
            meta: {
              uuid: '45454545-4545-4455-8455-454545454545',
            },
            content: {
              image: {
                wideScreen: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                desktop: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                tablet: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                mobile: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                alt: 'alt text',
                imageAlignment: 'right',
                fillMode: 'fill',
                aspectRatio: '16 / 9',
              },
              text: {
                textOverlay: '',
                textOverlayColor: '#333333',
                textOverlayAlignY: 'center',
                textOverlayAlignX: 'center',
              },
              button: {
                label: '',
                link: '',
                variant: 'primary',
              },
              layout: {
                fullWidth: false,
              },
            },
          },
          de: {
            name: 'Image',
            type: 'content',
            meta: {
              uuid: '45454545-4545-4455-8455-454545454545',
            },
            content: {
              image: {
                wideScreen: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                desktop: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                tablet: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                mobile: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                alt: 'alt text',
                imageAlignment: 'right',
                fillMode: 'fill',
                aspectRatio: '16 / 9',
              },
              text: {
                textOverlay: '',
                textOverlayColor: '#333333',
                textOverlayAlignY: 'center',
                textOverlayAlignX: 'center',
              },
              button: {
                label: '',
                link: '',
                variant: 'primary',
              },
              layout: {
                fullWidth: false,
              },
            },
          },
        },
      },
      {
        title: 'Image Right Text',
        image: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/image_left_text.png',
        template: {
          en: {
            name: 'MultiGrid',
            type: 'structure',
            meta: {
              uuid: '34343434-3434-4343-8434-343434343434',
            },
            configuration: {
              columnWidths: [6, 6],
              layout: {
                fullWidth: false,
              },
            },
            content: [
              {
                name: 'Image',
                type: 'content',
                meta: {
                  uuid: '45454545-4545-4455-8455-454545454545',
                },
                parent_slot: 0,
                content: {
                  image: {
                    wideScreen: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    desktop: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    tablet: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    mobile: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    alt: 'alt text',
                    imageAlignment: 'right',
                    fillMode: 'fill',
                    aspectRatio: '16 / 9',
                  },
                  text: {
                    textOverlay: '',
                    textOverlayColor: '#333333',
                    textOverlayAlignY: 'center',
                    textOverlayAlignX: 'center',
                  },
                  button: {
                    label: '',
                    link: '',
                    variant: 'primary',
                  },
                },
              },
              {
                name: 'TextCard',
                type: 'content',
                meta: {
                  uuid: '56565656-5656-4565-8565-565656565656',
                },
                parent_slot: 1,
                content: {
                  text: {
                    htmlDescription: '<p style="text-align: left;">Text that supports HTML formatting</p>',
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
                  layout: {
                    backgroundColor: '#ffffff',
                    paddingTop: '0',
                    paddingBottom: '0',
                    paddingLeft: '0',
                    paddingRight: '0',
                    keepTransparent: 'true',
                  },
                },
              },
            ],
          },
          de: {
            name: 'MultiGrid',
            type: 'structure',
            meta: {
              uuid: '67676767-6767-4676-8767-676767676767',
            },
            configuration: {
              columnWidths: [6, 6],
              layout: {
                fullWidth: false,
              },
            },
            content: [
              {
                name: 'Image',
                type: 'content',
                meta: {
                  uuid: '78787878-7878-4787-8787-787878787878',
                },
                parent_slot: 0,
                content: {
                  image: {
                    wideScreen: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    desktop: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    tablet: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    mobile: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    alt: 'Alt-Text',
                    imageAlignment: 'right',
                    fillMode: 'fill',
                    aspectRatio: '16 / 9',
                  },
                  text: {
                    textOverlay: '',
                    textOverlayColor: '#333333',
                    textOverlayAlignY: 'center',
                    textOverlayAlignX: 'center',
                  },
                  button: {
                    label: '',
                    link: '',
                    variant: 'primary',
                  },
                },
              },
              {
                name: 'TextCard',
                type: 'content',
                meta: {
                  uuid: '89898989-8989-4898-8889-898989898989',
                },
                parent_slot: 1,
                content: {
                  text: {
                    htmlDescription: '<p style="text-align: left;">Text mit HTML-Formatierung</p>',
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
                },
              },
            ],
          },
        },
      },
      {
        title: 'Image Left Text',
        image: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/image_right_text.png',
        template: {
          en: {
            name: 'MultiGrid',
            type: 'structure',
            meta: {
              uuid: '9a9a9a9a-9a9a-49a9-89a9-9a9a9a9a9a9a',
            },
            configuration: {
              columnWidths: [6, 6],
              layout: {
                fullWidth: false,
              },
            },
            content: [
              {
                name: 'TextCard',
                type: 'content',
                meta: {
                  uuid: 'bababaab-baba-4bab-8bab-babababababa',
                },
                parent_slot: 0,
                content: {
                  text: {
                    htmlDescription: '<p style="text-align: left;">Text that supports HTML formatting</p>',
                    title: 'h2 heading',
                    subtitle: 'Subtitle',
                    textAlignment: 'left',
                    color: '#000',
                  },
                  button: {
                    label: 'Button',
                    link: '/',
                    variant: 'primary',
                  },
                },
              },
              {
                name: 'Image',
                type: 'content',
                meta: {
                  uuid: 'cbcbcbcb-cbcb-4bcb-8bcb-cbcbcbcbcbcb',
                },
                parent_slot: 1,
                content: {
                  image: {
                    wideScreen: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    desktop: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    tablet: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    mobile: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    alt: 'Headphones',
                    imageAlignment: 'left',
                    fillMode: 'fill',
                    aspectRatio: '16 / 9',
                  },
                  text: {
                    textOverlay: '',
                    textOverlayColor: '#333333',
                    textOverlayAlignY: 'center',
                    textOverlayAlignX: 'center',
                  },
                  button: {
                    label: '',
                    link: '',
                    variant: 'primary',
                  },
                },
              },
            ],
          },
          de: {
            name: 'MultiGrid',
            type: 'structure',
            meta: {
              uuid: 'dcdcdcdc-dcdc-4cdc-8cdc-dcdcdcdcdcdc',
            },
            configuration: {
              columnWidths: [6, 6],
              layout: {
                fullWidth: false,
              },
            },
            content: [
              {
                name: 'TextCard',
                type: 'content',
                meta: {
                  uuid: 'edededed-eded-4ded-8ded-edededededed',
                },
                parent_slot: 0,
                content: {
                  text: {
                    htmlDescription: '<p style="text-align: left;">Text mit HTML-Formatierung</p>',
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
                },
              },
              {
                name: 'Image',
                type: 'content',
                meta: {
                  uuid: 'fefefefe-fefe-4fef-8fef-fefefefefefe',
                },
                parent_slot: 1,
                content: {
                  image: {
                    wideScreen: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    desktop: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    tablet: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    mobile: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
                    alt: 'Headphones',
                    imageAlignment: 'left',
                    fillMode: 'fill',
                    aspectRatio: '16 / 9',
                  },
                  text: {
                    textOverlay: '',
                    textOverlayColor: '#333333',
                    textOverlayAlignY: 'center',
                    textOverlayAlignX: 'center',
                  },
                  button: {
                    label: '',
                    link: '',
                    variant: 'primary',
                  },
                },
              },
            ],
          },
        },
      },
    ],
  },
} satisfies BlocksListContribution;
