import { BannerSliderObject } from "../../support/pageObjects/BannerSliderObject";
import { paths } from "../../../utils/paths";



describe('Banner Slider Block Form', () => {
  const bannerSlider = new BannerSliderObject();

  const openSettingsForBannerSliderBlock = () => {
    cy.get('[data-testid="open-editor-button"]')
      .eq(0)
      .should('exist')
      .click();

    cy.get('[data-testid="banner-carousel-form"]').should('exist');
  };

  beforeEach(() => {
    cy.visitAndHydrate(paths.home);
    openSettingsForBannerSliderBlock();
  });

  describe('Slide Settings', () => {
    it('should display the slide whose settings are open', () => {
      bannerSlider.checkIsBannerImageVisible(0);
      bannerSlider.checkSlideSettings(0);
      bannerSlider.openSlideOneSettings();
      bannerSlider.checkIsBannerImageVisible(1);
      bannerSlider.checkSlideSettings(1);
    });

    it('should add a new slide via quick add', () => {
      bannerSlider.quickAddSlide();
      bannerSlider.checkIsBannerImageVisible(2);
    });

    it('should add a new slide via the actions menu', () => {
      bannerSlider.openSlideActions();
      bannerSlider.addSlide();
      bannerSlider.checkIsBannerImageVisible(2);
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

    it('should move a slide up and down', () => {
      bannerSlider.openSlideActions();
      bannerSlider.addSlide();
      bannerSlider.openSlideActions();
      bannerSlider.moveSlideUp(2);
      bannerSlider.checkSlideSettings(1);
      bannerSlider.openSlideActions();
      bannerSlider.moveSlideDown(1);
      bannerSlider.checkSlideSettings(2);
    });
    
    it('should not move up the first slide', () => {
      bannerSlider.openSlideActions();
      bannerSlider.checkIsMoveSlideUpDisabled(0);
    });
    
    it('should not move down the last slide', () => {
      bannerSlider.openSlideActions();
      bannerSlider.checkIsMoveSlideDownDisabled(1);
    });
  });

  describe('Image Settings', () => {
    it('should open the image settings', () => {
      cy.get('[data-testid="banner-image-0"]').should('be.visible');
      bannerSlider.openImageGroup();
    });


    it('should change the image', () => {
      bannerSlider.changeBannerImage();
      bannerSlider.checkNewBannerImage();
      bannerSlider.checkBannerAltText();
    });
  });

  describe('Text Settings', () => {
    it('should change the texts', () => {
      bannerSlider.closeImageGroup();
      bannerSlider.openTextGroup();
      bannerSlider.changeTexts();
      bannerSlider.checkNewTexts();
    });

    it('should change the text box alignment x', () => {
      bannerSlider.closeImageGroup();
      bannerSlider.openTextGroup();
      bannerSlider.scrollFormDown();
      bannerSlider.alignBoxCenterX();
      bannerSlider.alignBoxBottomX();
      bannerSlider.alignBoxTopX();
      });


    it('should change the text box alignment y', () => {
      bannerSlider.closeImageGroup();
      bannerSlider.openTextGroup();
      bannerSlider.scrollFormDown();
      bannerSlider.alignBoxCenterY();
      bannerSlider.alignBoxRightY();
      bannerSlider.alignBoxLeftY();
    });

    it('should change the text alignment ', () => {
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
      bannerSlider.closeImageGroup();
      bannerSlider.closeTextGroup();
      bannerSlider.changeButtonLabelAndLink();
      bannerSlider.checkButtonLabelAndLink();      
      bannerSlider.checkButtonSecondary();
      bannerSlider.checkButtonPrimary();
    });
  });
});