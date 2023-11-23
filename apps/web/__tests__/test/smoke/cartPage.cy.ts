import { CartPageObject } from '../../support/pageObjects/CartPageObject';
import { ProductListPageObject } from '../../support/pageObjects/ProductListPageObject';

const cart = new CartPageObject();
const productListPage = new ProductListPageObject();

describe('Smoke: Cart Page', () => {

  beforeEach(() => {
    cy.setCookie('vsf-locale', 'en');
    cy.setCookie('consent-cookie', '{"Essentials":{"Session":true,"Consent":true,"Session2":true},"External Media":{"Session":false,"Consent":false,"Session2":false},"Functional":{"Session":false,"Consent":false,"Session2":false},"Marketing":{"Session":false,"Consent":false,"Session2":false}}')
  });
  

  it('[smoke] Add items to cart and display it', () => {
    cy.visitAndHydrate('/c/gear');
    cy.intercept('/plentysystems/doAddCartItem').as('doAddCartItem');

    productListPage.addToCart();
    cy.wait('@doAddCartItem');
    
    cart.openCart().checkCart();
  });
});
