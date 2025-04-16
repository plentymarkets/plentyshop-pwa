import { paths } from '../../../utils/paths';
import { CartPageObject } from '../../support/pageObjects/CartPageObject';
import { CheckoutPageObject } from '../../support/pageObjects/CheckoutPageObject';
import { HomePageObject } from '../../support/pageObjects/HomePageObject';
import { ProductListPageObject } from '../../support/pageObjects/ProductListPageObject';
import { MyAccountPageObject } from '../../support/pageObjects/MyAccountPageObject';
import { PaymentStatusScreen } from '../../support/pageObjects/PaymentStatusScreen';

const checkout = new CheckoutPageObject();
const cart = new CartPageObject();
const homePage = new HomePageObject();
const productListPage = new ProductListPageObject();
const myAccount = new MyAccountPageObject();
const pymentStatus = new PaymentStatusScreen();

beforeEach(() => {
  cy.clearCookies();
  cy.setCookie('vsf-locale', 'en');
  cy.setCookie(
    'consent-cookie',
    '{"CookieBar.essentials.label":{"CookieBar.essentials.cookies.plentyId.name":true,"CookieBar.essentials.cookies.vsfLocale.name":true,"CookieBar.essentials.cookies.consentCookie.name":true,"CookieBar.essentials.cookies.cloudflareTurnstile.name":true},"CookieBar.externalMedia.label":{},"CookieBar.functional.label":{"CookieBar.functional.cookies.scriptDemo.name":true,"CookieBar.essentials.cookies.payPal.name":true},"CookieBar.marketing.label":{}}',
  );
  cy.visitAndHydrate(paths.home);
});

describe('Mollie payment methods', () => {
  // it('[feature] Check mollie credit cardpayment and place a test order', () => {
  //   homePage.goToCategory();
  //   productListPage.addToCart();
  //   cart.openCart();

  //   checkout
  //     .goToCheckout()
  //     .goToGuestCheckout()
  //     .fillContactInformationForm()
  //     .checkMollieCreditCard()
  //     .fillShippingAddressForm()
  //     .acceptTerms()
  //     .placeOrderButtons.click();

  //   cy.wait(4000);

  //   checkout.mollieCreditCardModal.should('exist');
  // });

  it('[feature] Check mollie credit cardpayment and place a test order', () => {
    cy.setCookie('vsf-locale', 'de');
    cy.visitAndHydrate('/de' + paths.authLogin, {
      onBeforeLoad(win) {
        const originalAssign = win.location.assign;
        const originalReplace = win.location.replace;

        // Hook into assign and replace
        win.location.assign = function (url: string) {
          if (url.startsWith('https://mevofvd5omld.c01-14.plentymarkets.com')) {
            console.log('Redirect intercepted: assign -> redirecting to localhost');
            originalAssign.call(win.location, 'http://localhost:3000');
          } else {
            originalAssign.call(win.location, url);
          }
        };

        win.location.replace = function (url: string) {
          if (url.startsWith('https://mevofvd5omld.c01-14.plentymarkets.com')) {
            console.log('Redirect intercepted: replace -> redirecting to localhost');
            originalReplace.call(win.location, 'http://localhost:3000');
          } else {
            originalReplace.call(win.location, url);
          }
        };

        // Auch direktes Setzen von href abfangen
        Object.defineProperty(win.location, 'href', {
          set(url: string) {
            if (url.startsWith('https://mevofvd5omld.c01-14.plentymarkets.com')) {
              console.log('Redirect intercepted: href -> redirecting to localhost');
              originalAssign.call(win.location, 'http://localhost:3000');
            } else {
              originalAssign.call(win.location, url);
            }
          },
        });
      },
    });

    cy.intercept('/plentysystems/doLogin').as('doLogin');
    myAccount.successLogin();
    cy.wait('@doLogin');

    homePage.goToCategory();
    productListPage.addToCart();
    cart.openCart();

    checkout.goToCheckout().acceptTerms().checkMollieEPS().placeOrderButtons.click();

    pymentStatus.selectPaid();

    cy.visit('http://localhost:3000', {});

    // cy.origin('https://mevofvd5omld.c01-14.plentymarkets.com/de/mollie-payment', () => {
    //   cy.log('test');
    //   cy.on('uncaught:exception', (err) => {
    //     if (err.message.includes('Cannot redefine property: cookie')) {
    //       return false;
    //     }
    //   });
    // });
    // cy.visit('http://localhost:3000/de/mollie-payment');
  });
});
