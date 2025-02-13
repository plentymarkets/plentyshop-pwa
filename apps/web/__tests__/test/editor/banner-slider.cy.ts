import { PageObject } from "../../support/pageObjects/PageObject";
import { paths } from "../../../utils/paths";

class BannerSliderObject extends PageObject {
  openSlideActions() {
    cy.get('[data-testid="open-slide-actions"]').click();
  }

  openSlideOneSettings() {
    cy.get('[data-testid="slide-settings-1"]').click();
  }

  openSlideTwoSettings() {
    cy.get('[data-testid="slide-settings-2"]').click();
  }

  addSlide() {
    cy.get('[data-testid="actions-add-slide-button"]').click();
  }

  quickAddSlide() {
    cy.get('[data-testid="quick-add-slide-button"]').click();
  }

  checkSlideSettings(index: number) {
    cy.get(`[data-testid="slide-settings-${index}"]`).should('exist');
  }

  checkIsBannerImageVisible(index: number) {
    cy.get(`[data-testid="banner-image-${index}"]`).should('be.visible');
  }

  checkIsMoveSlideUpDisabled(index: number) {
    cy.get(`[data-testid="actions-move-slide-up-${index}"]`).should('not.exist');
  }

  checkIsMoveSlideDownDisabled(index: number) {
    cy.get(`[data-testid="actions-move-slide-down-${index}"]`).should('not.exist');
  }

  moveSlideUp(index: number) {
    cy.get(`[data-testid="actions-move-slide-up-${index}"]`).click();
  }

  moveSlideDown(index: number) {
    cy.get(`[data-testid="actions-move-slide-down-${index}"]`).click();
  }
}


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
      cy.get('[data-testid="actions-delete-slide-1"]').click();
      cy.get('[data-testid="banner-image-1"]').should('not.exist');
      cy.get('[data-testid="open-slide-actions"]').should('not.exist');
    });

    it('should not show the actions menu if only 1 slide exists', () => {
      bannerSlider.openSlideActions();
      cy.get('[data-testid="actions-delete-slide-1"]').click();
      cy.get('[data-testid="open-slide-actions"]').should('not.exist');
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

  describe.only('Image Settings', () => {
    it('should open the image settings', () => {
      cy.get('[data-testid="banner-image-0"]').should('be.visible');
    });
  });
});