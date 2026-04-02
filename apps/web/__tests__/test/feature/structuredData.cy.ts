/* eslint-disable @typescript-eslint/no-unused-expressions */
import { ProductDetailPageObject } from '../../support/pageObjects/ProductDetailPageObject';

const productDetailPage = new ProductDetailPageObject();

const PRODUCT_1_URL = '/bag-azur_163_1106';
const PRODUCT_2_URL = '/backpack-gaia_164';

const getProductStructuredData = (callback: (data: Record<string, unknown> | undefined) => void) => {
  cy.get('script[type="application/ld+json"]').then((scripts) => {
    const data = [...scripts]
      .map((script) => {
        try {
          return JSON.parse(script.innerHTML) as Record<string, unknown>;
        } catch {
          return null;
        }
      })
      .find((item) => item?.['@type'] === 'Product');
    callback(data || undefined);
  });
};

describe('Structured Data: product page', () => {
  it('[feature] should have valid Product structured data', () => {
    cy.visitAndHydrate(PRODUCT_1_URL);
    productDetailPage.assertStructuredData();
  });
});

describe('Structured Data: product switching', () => {
  it('updates structured data when navigating between two different products', () => {
    cy.visitAndHydrate(PRODUCT_1_URL);
    productDetailPage.assertProductStructuredDataExists();

    let firstProductName: string;
    let firstProductIdentifier: string;

    getProductStructuredData((firstData) => {
      expect(firstData).to.not.be.undefined;
      firstProductName = firstData!['name'] as string;
      firstProductIdentifier = firstData!['identifier'] as string;
      expect(firstProductName).to.be.a('string').and.not.be.empty;
    });

    cy.intercept('/plentysystems/getReview').as('getReview2');

    cy.visitAndHydrate(PRODUCT_2_URL);
    cy.wait(['@getReview2']);

    productDetailPage.assertProductStructuredDataExists();

    getProductStructuredData((secondData) => {
      expect(secondData).to.not.be.undefined;
      const secondProductName = secondData!['name'] as string;
      const secondProductIdentifier = secondData!['identifier'] as string;

      expect(secondProductName).to.be.a('string').and.not.be.empty;
      expect(secondProductName).to.not.equal(firstProductName);
      expect(secondProductIdentifier).to.not.equal(firstProductIdentifier);
    });
  });
});
