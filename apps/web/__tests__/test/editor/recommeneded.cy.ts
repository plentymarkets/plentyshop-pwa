import { paths } from '../../../app/utils/paths';
import { CookieBarObject } from '../../support/pageObjects/CookieBarObject';

describe('Recommended Block Form', () => {
  const checkIsRecommendedBlockIsVisible = () => {
    cy.getByTestId('recommended-block').should('be.visible');
  };

  const clickOnRecommendedBlockEditButton = () => {
    cy.getByTestId('recommended-block')
      .closest('[data-testid="block-wrapper"]')
      .find('[data-testid="open-editor-button"]')
      .last()
      .click();
  };

  const typeInRecommendedForm = (field: string, value: string) => {
    cy.getByTestId(`recommended-form-${field}`).clear().type(value);
  };

  const checkIfRecommendedBlockHasText = (field: string, text: string) => {
    cy.getByTestId('recommended-block').find(`[data-testid="text-${field}"]`).last().should('have.text', text);
  };

  const changeTextAlinment = (value: string) => {
    cy.getByTestId(`recommended-form-text-align-${value}`).should('exist').click();
  };

  const changeColor = (value: string) => {
    cy.getByTestId(`recommended-form-color`).clear().type(value);
  };

  const checkClassOnRecommendedBlock = (className: string) => {
    cy.getByTestId('recommended-block').should('have.class', className);
  };

  const checkStyleOnRecommendedBlock = () => {
    cy.getByTestId('recommended-block')
      .find(`[data-testid="text-title"]`)
      .last()
      .should('have.css', 'color', 'rgb(0, 255, 0)');
  };

  const cookieBar = new CookieBarObject();

  beforeEach(() => {
    cy.clearCookies();
    cy.visitAndHydrate(paths.home);
    cookieBar.acceptAll();
    clickOnRecommendedBlockEditButton();
  });

  it('should ensure recommended block is visible', () => {
    checkIsRecommendedBlockIsVisible();
  });

  it('should change the pretitle on recommended form', () => {
    typeInRecommendedForm('pretitle', 'Pretitle');
    checkIfRecommendedBlockHasText('pretitle', 'Pretitle');
  });

  it('should change the title on recommended form', () => {
    typeInRecommendedForm('title', 'New title');
    checkIfRecommendedBlockHasText('title', 'New title');
  });

  it('should change the subtitle on recommended form', () => {
    typeInRecommendedForm('subtitle', 'New subtitle');
    checkIfRecommendedBlockHasText('subtitle', 'New subtitle');
  });

  it('should change the description on recommended form', () => {
    typeInRecommendedForm('html', 'New description');
    checkIfRecommendedBlockHasText('html', 'New description');
  });

  it('should change the color on recommended form', () => {
    changeColor('#00ff00');
    checkStyleOnRecommendedBlock();
  });

  it('should change the text Alignment on recommended form', () => {
    changeTextAlinment('right');
    checkClassOnRecommendedBlock('text-right');
  });

  it('should change the categoryId on recommended form', () => {
    const firstProductTitle = 'Lounge chair Herkules';
    const categoryId = '16';
    cy.intercept('/plentysystems/getFacet').as('getFacet');
    typeInRecommendedForm('categoryid', categoryId);
    cy.wait('@getFacet');
    cy.getByTestId('product-slider')
      .last()
      .should('exist')
      .within(() => {
        cy.get('[data-testid="productcard-name"]')
          .first()
          .invoke('text')
          .then((text) => {
            expect(text.trim()).to.equal(firstProductTitle);
          });
      });
  });
});
