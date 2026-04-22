import { BannerSliderObject } from '../../support/pageObjects/BannerSliderObject';
import { paths } from '../../../app/utils/paths';
import { CookieBarObject } from '../../support/pageObjects/CookieBarObject';

describe('Banner Slider Block Form', () => {
  const bannerSlider = new BannerSliderObject();
  const cookieBar = new CookieBarObject();
  const openSettingsForBannerSliderBlock = () => {
    cy.get('[data-testid="Carousel-open-editor-button"]').eq(0).should('exist').click();

    cy.get('[data-testid="banner-carousel-form"]').should('exist');
  };

  beforeEach(() => {
    cy.intercept('plentysystems/getStorageItems', {
      statusCode: 200,
      body: {
        data: [
          {
            key: '123-demo-picture.jpeg',
            lastModified: '2025-08-06T11:06:05+00:00',
            eTag: '4db976b8578d71ee74710e48ad01dc35',
            size: '1009370',
            storageClass: 'STANDARD',
            publicUrl: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/123-demo-picture.jpeg',
            previewUrl: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/.thumbs/123-demo-picture.jpeg',
          },
        ],
      },
    }).as('getStorageItems');
    cy.intercept('plentysystems/getStorageMetadata', { statusCode: 200, body: {} }).as('getStorageMetadata');

    cy.clearCookies();
    cy.clearConfig();
    cy.setConfig({ isPreview: true });
    cy.visitAndHydrate(paths.home);
    cookieBar.acceptAll();
    openSettingsForBannerSliderBlock();
  });

  describe('Slide Settings', () => {
    it('should display the slide whose settings are open', () => {
      bannerSlider.checkIsBannerImageVisible(0);
      bannerSlider.openSlideOneSettings();
      bannerSlider.checkIsBannerImageVisible(0);
      bannerSlider.goBackToElementList();
      bannerSlider.openSlideTwoSettings();
      bannerSlider.checkIsBannerImageVisible(1);
    });

    it('should add a new slide via quick add', () => {
      bannerSlider.quickAddSlide();
      bannerSlider.checkIsNewBannerImageVisible();
      bannerSlider.openSlideOneSettings();
    });

    it('should remove a slide', () => {
      bannerSlider.openSlideActions();
      bannerSlider.deleteSlide();
      bannerSlider.checkIfSlideIsDeleted();
    });

    it('should not show the actions menu if only 1 slide exists', () => {
      bannerSlider.openSlideActions();
      bannerSlider.deleteSlide();
      bannerSlider.checkIfSlideActionsAreVisible();
    });
  });

  describe('Image Settings', () => {
    it('should open the image settings', () => {
      bannerSlider.openSlideOneSettings();
      bannerSlider.openImageGroup();
      bannerSlider.openImageSelector('wideScreen');
      bannerSlider.selectImage();
      bannerSlider.checkNewBannerImage();
    });
  });

  describe('Text Settings', () => {
    it('should change the texts', () => {
      bannerSlider.openSlideOneSettings();
      bannerSlider.closeImageGroup();
      bannerSlider.openTextGroup();
      bannerSlider.changeTexts();
      bannerSlider.checkNewTexts();
    });

    it('should change the text box alignment x', () => {
      bannerSlider.openSlideOneSettings();
      bannerSlider.closeImageGroup();
      bannerSlider.openTextGroup();
      bannerSlider.scrollFormDown();
      bannerSlider.alignBoxCenterX();
      bannerSlider.alignBoxBottomX();
      bannerSlider.alignBoxTopX();
    });

    it('should change the text box alignment y', () => {
      bannerSlider.openSlideOneSettings();
      bannerSlider.closeImageGroup();
      bannerSlider.openTextGroup();
      bannerSlider.scrollFormDown();
      bannerSlider.alignBoxCenterY();
      bannerSlider.alignBoxRightY();
      bannerSlider.alignBoxLeftY();
    });

    it('should change the text alignment ', () => {
      bannerSlider.openSlideOneSettings();
      bannerSlider.closeImageGroup();
      bannerSlider.openTextGroup();
      bannerSlider.scrollFormDown();
      bannerSlider.textAlignCenter();
      bannerSlider.textAlignRight();
      bannerSlider.textAlignLeft();
    });
  });

  describe('Button Settings', () => {
    it('should change the texts', () => {
      bannerSlider.openSlideOneSettings();
      bannerSlider.closeImageGroup();
      bannerSlider.closeTextGroup();
      bannerSlider.changeButtonLabelAndLink();
      bannerSlider.checkButtonLabelAndLink();
      bannerSlider.checkButtonSecondary();
      bannerSlider.checkButtonPrimary();
    });
  });
});
