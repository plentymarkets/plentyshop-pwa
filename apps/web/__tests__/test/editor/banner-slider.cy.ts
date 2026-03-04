import { BannerSliderObject } from '../../support/pageObjects/BannerSliderObject';
import { paths } from '../../../app/utils/paths';
import { CookieBarObject } from '../../support/pageObjects/CookieBarObject';

describe('Banner Slider Block Form', () => {
  const bannerSlider = new BannerSliderObject();
  const cookieBar = new CookieBarObject();
  let firstBannerBlockUuid: string;
  let secondBannerBlockUuid: string;

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
    cy.visitAndHydrate(paths.home);
    cookieBar.acceptAll();
    openSettingsForBannerSliderBlock();

    bannerSlider.clearBannerCache();
    bannerSlider.getFirstBannerBlockUuid().then((uuid) => {
      firstBannerBlockUuid = uuid;
    });
    bannerSlider.getSecondBannerBlockUuid().then((uuid) => {
      secondBannerBlockUuid = uuid;
    });
  });

  describe('Slide Settings', () => {
    it('should display the slide whose settings are open', () => {
      bannerSlider.checkIsBannerImageVisible(firstBannerBlockUuid);
      bannerSlider.openSlideOneSettings();
      bannerSlider.checkIsBannerImageVisible(firstBannerBlockUuid);
      bannerSlider.goBackToElementList();
      bannerSlider.openSlideTwoSettings();
      bannerSlider.checkIsBannerImageVisible(secondBannerBlockUuid);
    });

    it('should add a new slide via quick add', () => {
      bannerSlider.quickAddSlide();
      bannerSlider.checkIsNewBannerImageVisible();
      bannerSlider.openSlideOneSettings();
    });

    it('should add a new slide via the actions menu', () => {
      bannerSlider.openSlideActions();
      bannerSlider.addSlide();
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
      bannerSlider.checkNewBannerImage(firstBannerBlockUuid);
    });
  });

  describe('Text Settings', () => {
    it('should change the texts', () => {
      bannerSlider.openSlideOneSettings();
      bannerSlider.closeImageGroup();
      bannerSlider.openTextGroup();
      bannerSlider.changeTexts();
      cy.log('[Text Settings] Changed texts in form, waiting for banner update...');
      // eslint-disable-next-line no-console
      console.log('[Text Settings] Changed texts in form, waiting for banner update...');
      // Wait for banner to update after text changes
      cy.wait(500);
      cy.log('[Text Settings] Wait complete, checking if banner has new text...');
      // eslint-disable-next-line no-console
      console.log('[Text Settings] Wait complete, checking if banner has new text...');
      cy.get('[data-testid^="banner-pretitle-"]').should('contain.text', 'New Pre-Title');
      cy.log('[Text Settings] Banner has new text, clearing cache and fetching UUID...');
      // eslint-disable-next-line no-console
      console.log('[Text Settings] Banner has new text, clearing cache and fetching UUID...');
      bannerSlider.clearBannerCache();
      bannerSlider.getFirstBannerBlockUuid().then((uuid) => {
        cy.log(`[Text Settings] Got UUID: ${uuid}, now checking all texts...`);
        // eslint-disable-next-line no-console
        console.log(`[Text Settings] Got UUID: ${uuid}, now checking all texts...`);
        bannerSlider.checkNewTexts(uuid);
        cy.log('[Text Settings] All text checks passed!');
        // eslint-disable-next-line no-console
        console.log('[Text Settings] All text checks passed!');
      });
    });

    it('should change the text box alignment x', () => {
      bannerSlider.openSlideOneSettings();
      bannerSlider.closeImageGroup();
      bannerSlider.openTextGroup();
      bannerSlider.scrollFormDown();
      bannerSlider.alignBoxCenterX(firstBannerBlockUuid);
      bannerSlider.alignBoxBottomX(firstBannerBlockUuid);
      bannerSlider.alignBoxTopX(firstBannerBlockUuid);
    });

    it('should change the text box alignment y', () => {
      bannerSlider.openSlideOneSettings();
      bannerSlider.closeImageGroup();
      bannerSlider.openTextGroup();
      bannerSlider.scrollFormDown();
      bannerSlider.alignBoxCenterY(firstBannerBlockUuid);
      bannerSlider.alignBoxRightY(firstBannerBlockUuid);
      bannerSlider.alignBoxLeftY(firstBannerBlockUuid);
    });

    it('should change the text alignment ', () => {
      bannerSlider.openSlideOneSettings();
      bannerSlider.closeImageGroup();
      bannerSlider.openTextGroup();
      bannerSlider.scrollFormDown();
      bannerSlider.textAlignCenter(firstBannerBlockUuid);
      bannerSlider.textAlignRight(firstBannerBlockUuid);
      bannerSlider.textAlignLeft(firstBannerBlockUuid);
    });
  });

  describe('Button Settings', () => {
    it('should change the texts', () => {
      bannerSlider.openSlideOneSettings();
      bannerSlider.closeImageGroup();
      bannerSlider.closeTextGroup();
      bannerSlider.changeButtonLabelAndLink();
      cy.log('[Button Settings] Changed button in form, waiting for banner update...');
      // eslint-disable-next-line no-console
      console.log('[Button Settings] Changed button in form, waiting for banner update...');
      cy.wait(500);
      cy.log('[Button Settings] Wait complete, checking if banner has new button...');
      // eslint-disable-next-line no-console
      console.log('[Button Settings] Wait complete, checking if banner has new button...');
      cy.get('[data-testid^="banner-button-"]').should('contain.text', 'New Button Label');
      cy.log('[Button Settings] Banner has new button, clearing cache and fetching UUID...');
      // eslint-disable-next-line no-console
      console.log('[Button Settings] Banner has new button, clearing cache and fetching UUID...');
      bannerSlider.clearBannerCache();
      bannerSlider.getFirstBannerBlockUuid().then((uuid) => {
        cy.log(`[Button Settings] Got UUID: ${uuid}, now checking button properties...`);
        // eslint-disable-next-line no-console
        console.log(`[Button Settings] Got UUID: ${uuid}, now checking button properties...`);
        bannerSlider.checkButtonLabelAndLink(uuid);
        bannerSlider.checkButtonSecondary(uuid);
        bannerSlider.checkButtonPrimary(uuid);
        cy.log('[Button Settings] All button checks passed!');
        // eslint-disable-next-line no-console
        console.log('[Button Settings] All button checks passed!');
      });
    });
  });
});
