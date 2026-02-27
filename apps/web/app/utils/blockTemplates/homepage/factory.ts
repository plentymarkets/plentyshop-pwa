import type { Block } from '@plentymarkets/shop-api';
import { createFooter } from '../footer/factory';

export function createHomepage(): Block[] {
  const banner1Pretitle = t('defaultTemplate.homepage.carousel.banner1.pretitle');
  const banner1Title = t('defaultTemplate.homepage.carousel.banner1.title');
  const banner1Description = t('defaultTemplate.homepage.carousel.banner1.description');
  const banner1ButtonLabel = t('defaultTemplate.homepage.carousel.banner1.buttonLabel');
  const banner2Pretitle = t('defaultTemplate.homepage.carousel.banner2.pretitle');
  const banner2Title = t('defaultTemplate.homepage.carousel.banner2.title');
  const banner2Description = t('defaultTemplate.homepage.carousel.banner2.description');
  const banner2ButtonLabel = t('defaultTemplate.homepage.carousel.banner2.buttonLabel');
  const welcomePretitle = t('defaultTemplate.homepage.textcard.welcome.pretitle');
  const welcomeTitle = t('defaultTemplate.homepage.textcard.welcome.title');
  const welcomeSubtitle = t('defaultTemplate.homepage.textcard.welcome.subtitle');
  const welcomeParagraph1 = t('defaultTemplate.homepage.textcard.welcome.paragraph1');
  const welcomeParagraph2 = t('defaultTemplate.homepage.textcard.welcome.paragraph2');
  const welcomeButtonLabel = t('defaultTemplate.homepage.textcard.welcome.buttonLabel');
  const welcomeDescription = `<p>${welcomeParagraph1}</p><p>${welcomeParagraph2}</p>`;
  const multigridTitle = t('defaultTemplate.homepage.multigrid.textcard.title');
  const multigridSubtitle = t('defaultTemplate.homepage.multigrid.textcard.subtitle');
  const multigridParagraph = t('defaultTemplate.homepage.multigrid.textcard.paragraph');
  const multigridFeature1 = t('defaultTemplate.homepage.multigrid.textcard.feature1');
  const multigridFeature2 = t('defaultTemplate.homepage.multigrid.textcard.feature2');
  const multigridFeature3 = t('defaultTemplate.homepage.multigrid.textcard.feature3');
  const multigridFeature4 = t('defaultTemplate.homepage.multigrid.textcard.feature4');
  const multigridButtonLabel = t('defaultTemplate.homepage.multigrid.textcard.buttonLabel');
  const multigridImageAlt = t('defaultTemplate.homepage.multigrid.image.alt');
  const multigridFeaturesList = [multigridFeature1, multigridFeature2, multigridFeature3, multigridFeature4]
    .map((feature) => `<li>${feature}</li>`)
    .join('');
  const multigridDescription = `<p>${multigridParagraph}</p><ul class='list-disc pl-4 mt-4 space-y-1'>${multigridFeaturesList}</ul>`;
  const fashionPretitle = t('defaultTemplate.homepage.productRecommended.fashion.pretitle');
  const fashionTitle = t('defaultTemplate.homepage.productRecommended.fashion.title');
  const fashionSubtitle = t('defaultTemplate.homepage.productRecommended.fashion.subtitle');
  const fashionLinkText = t('defaultTemplate.homepage.productRecommended.fashion.linkText');
  const fashionLinkUrl = t('defaultTemplate.homepage.productRecommended.fashion.linkUrl');
  const fashionDescription = `<a class='underline' href='${fashionLinkUrl}'>${fashionLinkText}</a>`;
  const newsletterTitle = t('defaultTemplate.homepage.newsletter.title');
  const newsletterDescription = t('defaultTemplate.homepage.newsletter.description');
  const newsletterButtonLabel = t('defaultTemplate.homepage.newsletter.buttonLabel');

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
              pretitle: banner1Pretitle,
              title: banner1Title,
              htmlDescription: banner1Description,
              textAlignment: 'left',
              justify: 'top',
              align: 'left',
              background: true,
            },
            button: {
              label: banner1ButtonLabel,
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
              pretitle: banner2Pretitle,
              title: banner2Title,
              htmlDescription: banner2Description,
              textAlignment: 'left',
              justify: 'top',
              align: 'left',
              background: true,
            },
            button: {
              label: banner2ButtonLabel,
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
          htmlDescription: welcomeDescription,
          pretitle: welcomePretitle,
          title: welcomeTitle,
          subtitle: welcomeSubtitle,
          textAlignment: 'center',
          color: '#000',
        },
        button: {
          label: welcomeButtonLabel,
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
          name: 'Image',
          type: 'content',
          meta: {
            uuid: '1c2d3e4f-5a6b-4c7d-8e9f-0a1b2c3d4e5f',
          },
          content: {
            wideScreen: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/headphones-mediacard.avif',
            desktop: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/headphones-mediacard.avif',
            tablet: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/headphones-mediacard.avif',
            mobile: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/headphones-mediacard.avif',
            alt: multigridImageAlt,
            imageAlignment: 'left',
          },
        },
        {
          name: 'TextCard',
          type: 'content',
          meta: {
            uuid: '6f5e4d3c-2b1a-4f8e-9d7c-0b1a2c3d4e5f',
          },
          content: {
            text: {
              htmlDescription: multigridDescription,
              title: multigridTitle,
              subtitle: multigridSubtitle,
              textAlignment: 'left',
              color: '#000',
            },
            button: {
              label: multigridButtonLabel,
              link: '/gear/headphones-capybara_157',
              variant: 'primary',
            },
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
          pretitle: fashionPretitle,
          title: fashionTitle,
          subtitle: fashionSubtitle,
          htmlDescription: fashionDescription,
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
          title: newsletterTitle,
          htmlDescription: newsletterDescription,
        },
        input: {
          displayNameInput: true,
          nameIsRequired: false,
        },
        button: {
          label: newsletterButtonLabel,
        },
        settings: {
          emailFolderId: 1,
        },
      },
    },
    createFooter(),
  ];
}
