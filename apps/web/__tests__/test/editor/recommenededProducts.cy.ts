import { paths } from '../../../app/utils/paths';
import { RecommendedProductsObject } from '../../support/pageObjects/RecommendedProductsObject';
import { CookieBarObject } from '../../support/pageObjects/CookieBarObject';
import searchCategoriesResponse from '../../fixtures/searchCategoriesResponse.json';

describe('Recommended Block Form', () => {
  const recommendedProducts = new RecommendedProductsObject();
  const cookieBar = new CookieBarObject();

  beforeEach(() => {
    cy.intercept('/plentysystems/getFacet').as('getFacet');
    cy.intercept('/plentysystems/getCategoriesSearch', {
      statusCode: 200,
      body: { ...searchCategoriesResponse },
    }).as('getCategoriesSearch');

    cy.clearCookies();
    cy.visitAndHydrate(paths.home);
    cookieBar.acceptAll();

    // prettier-ignore
    recommendedProducts
      .checkIsRecommendedBlockIsVisible()
      .clickOnRecommendedBlockEditButton();
  });

  it('should change the texts on recommended form', () => {
    recommendedProducts
      .openTextFormSection()
      .typeInRecommendedForm('pretitle', 'Pretitle')
      .typeInRecommendedForm('title', 'New title')
      .typeInRecommendedForm('subtitle', 'New subtitle')
      .typeInRecommendedForm('html', 'New description')
      .changeColor('#00ff00')
      .changeTextAlinment('right')

      .checkIfRecommendedBlockHasText('pretitle', 'Pretitle')
      .checkIfRecommendedBlockHasText('title', 'New title')
      .checkIfRecommendedBlockHasText('subtitle', 'New subtitle')
      .checkIfRecommendedBlockHasText('html', 'New description')
      .checkStyleOnRecommendedBlock()
      .checkClassOnRecommendedBlock('text-right');
  });

  it('should change the source on recommended form', () => {
    const expectedProductTitles = ['Lounge chair Herkules'];

    // prettier-ignore
    recommendedProducts
      .openSourceFormSection()
      .changeSelectedCategory('Armchair')
      .checkExpectedProductsInSlider(expectedProductTitles);
  });
});
