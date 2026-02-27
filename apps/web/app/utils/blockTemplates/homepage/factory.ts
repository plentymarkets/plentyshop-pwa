import type { Block } from '@plentymarkets/shop-api';
import type { HomepageContent } from './interface';
import { createFooter } from '../footer/factory';
import type { FooterContent } from '../footer/interface';

export function createHomepage(content: HomepageContent, footerContent: FooterContent): Block[] {
  return [
    {
      name: 'Carousel',
      type: 'structure',
      meta: {
        uuid: '3e1f8c9a-d2b4-4f8d-9c2b-8e1f3a7d5c9b',
      },
      configuration: {
        controls: {
          displayArrows: true,
          color: '#a39f9f',
        },
      },
      content: [
        {
          name: 'Banner',
          type: 'content',
          meta: {
            uuid: 'a7b3c1d9-2e6f-4a5b-8c7d-1e2f3b4c5a6d',
            isGlobalTemplate: false,
          },
          content: {
            image: {
              wideScreen: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Person/guy-1024.avif',
              desktop: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Person/guy-1024.avif',
              tablet: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Person/guy-768.avif',
              mobile: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Person/guy-320.avif',
              alt: '',
              brightness: 0.5,
            },
            text: {
              color: '#000',
              bgcolor: '#fff',
              bgopacity: 0.9,
              pretitle: content.carousel.banner1.pretitle,
              title: content.carousel.banner1.title,
              subtitle: content.carousel.banner1.subtitle,
              htmlDescription: content.carousel.banner1.description,
              textAlignment: 'left',
              justify: 'top',
              align: 'left',
              background: true,
            },
            button: {
              label: content.carousel.banner1.buttonLabel,
              link: '/gear/headphones-capybara_157',
              variant: 'primary',
            },
          },
        },
        {
          name: 'Banner',
          type: 'content',
          meta: {
            uuid: 'd4e1f2a3-b7c8-4d9e-8f1a-2b3c4d5e6f7a',
            isGlobalTemplate: false,
          },
          content: {
            image: {
              wideScreen: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Drone/drone-A-1024.avif',
              desktop: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Drone/drone-A-1024.avif',
              tablet: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Drone/drone-A-768.avif',
              mobile: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Drone/drone-A-320.avif',
              alt: '',
              brightness: 0.75,
            },
            text: {
              color: '#000',
              bgcolor: '#fff',
              bgopacity: 1,
              pretitle: content.carousel.banner2.pretitle,
              title: content.carousel.banner2.title,
              htmlDescription: content.carousel.banner2.description,
              textAlignment: 'left',
              justify: 'top',
              align: 'left',
              background: true,
            },
            button: {
              label: content.carousel.banner2.buttonLabel,
              link: '/gear/drone-omega_154',
              variant: 'primary',
            },
          },
        },
      ],
    },
    {
      name: 'TextCard',
      type: 'content',
      meta: {
        uuid: 'b1a2c3d4-5e6f-4a7b-8c9d-0e1f2a3b4c5d',
        isGlobalTemplate: false,
      },
      content: {
        text: {
          htmlDescription: content.textcard.welcome.description,
          pretitle: content.textcard.welcome.pretitle,
          title: content.textcard.welcome.title,
          subtitle: content.textcard.welcome.subtitle,
          textAlignment: 'center',
          color: '#000',
        },
        button: {
          label: content.textcard.welcome.buttonLabel,
          link: '',
          variant: 'primary',
        },
      },
    },
    {
      name: 'ProductRecommendedProducts',
      type: 'content',
      meta: {
        uuid: 'f7a6b5c4-d3e2-4f1a-9b8c-7d6e5f4a3b2c',
        isGlobalTemplate: false,
      },
      content: {
        categoryId: '73',
        text: {
          pretitle: '',
          title: '',
          subtitle: '',
          htmlDescription: '',
        },
      },
    },
    {
      name: 'MultiGrid',
      type: 'structure',
      meta: {
        uuid: '9b8a7c6d-5e4f-4d3c-ab1a-0f9e8d7c6b5a',
        isGlobalTemplate: false,
      },
      configuration: {
        columnWidths: [6, 6],
      },
      content: [
        {
          name: 'TextCard',
          type: 'content',
          content: {
            text: {
              htmlDescription: content.multigrid.textcard.description,
              title: content.multigrid.textcard.title,
              pretitle: content.multigrid.textcard.pretitle,
              subtitle: content.multigrid.textcard.subtitle,
              textAlignment: 'left',
              color: '#000',
            },
            button: {
              label: content.multigrid.textcard.buttonLabel,
              link: '/gear/headphones-capybara_157',
              variant: 'primary',
            },
          },
          meta: {
            uuid: '64f8c6ce-1503-4f29-b271-1d5c6a9a0adf',
          },
        },
        {
          name: 'Image',
          type: 'content',
          content: {
            wideScreen: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/headphones-mediacard.avif',
            desktop: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/headphones-mediacard.avif',
            tablet: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/headphones-mediacard.avif',
            mobile: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/headphones-mediacard.avif',
            alt: content.multigrid.image.alt,
            imageAlignment: 'left',
          },
          meta: {
            uuid: 'ddbb44fc-3af6-49b1-9f2a-2e0a9e2f6a15',
          },
        },
      ],
    },
    {
      name: 'ProductRecommendedProducts',
      type: 'content',
      meta: {
        uuid: 'g7a6b5c4-d3e2-4f1a-9b8c-7d6e5f4a3b2c',
        isGlobalTemplate: false,
      },
      content: {
        text: {
          pretitle: content.productRecommended.fashion.pretitle,
          title: content.productRecommended.fashion.title,
          subtitle: content.productRecommended.fashion.subtitle,
          htmlDescription: content.productRecommended.fashion.description,
        },
        source: {
          type: 'category',
          itemId: '',
          categoryId: '',
        },
      },
    },
    {
      name: 'NewsletterSubscribe',
      type: 'content',
      meta: {
        uuid: '0f1e2d3c-4b5a-4c7d-8e9f-1a2b3c4d5e6f',
        isGlobalTemplate: false,
      },
      content: {
        text: {
          bgColor: '#f5f5f5',
          title: content.newsletter.title,
          htmlDescription: content.newsletter.description,
        },
        input: {
          displayNameInput: true,
          nameIsRequired: false,
        },
        button: {
          label: content.newsletter.buttonLabel,
        },
        settings: {
          emailFolderId: 1,
        },
      },
    },
    createFooter(footerContent),
  ];
}
