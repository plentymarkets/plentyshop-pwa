import 'cypress-wait-until';
import 'cypress-iframe';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      getByTestId(id: string): Chainable;
      getFixture(id: string): Chainable;
      getByComponent(id: string): Chainable;
      waitUntilElementInDOM(id: () => Cypress.Chainable): Chainable;
      visit(url: string, options?: Partial<Cypress.VisitOptions>): Cypress.Chainable | null;
      visitAndHydrate(options: Partial<Cypress.VisitOptions> & { url: string }): Cypress.Chainable | null;
      visitSmoke(): Chainable;
      visitAndHydrate(url: string, options?: Partial<Cypress.VisitOptions>): Cypress.Chainable | null;
      clearServiceWorkers(): Cypress.Chainable | null;
      isScrolledTo(): Cypress.Chainable;
      addToCart(id?: number, quantity?: number): Cypress.Chainable;
      capturePopup(): Cypress.Chainable;
      popup(): Cypress.Chainable;
      paypalFlow(email: string, password: string): Cypress.Chainable;
      firstIFrame(): Cypress.Chainable;
      resetPopupStub(): Cypress.Chainable;
    }
  }
}

Cypress.Commands.add(
  'getByTestId',
  (
    testId: string,
    options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow> | undefined,
  ) => {
    cy.get(`[data-testid="${testId}"]`, options);
  },
);

Cypress.Commands.add('getByComponent', (Component: string) => {
  cy.get(`[Component="${Component}"]`);
});

Cypress.Commands.add('getFixture', (fixtureName: string) => {
  return cy.fixture(`../fixtures/${fixtureName}.json`).then((fixture) => {
    return fixture;
  });
});

Cypress.Commands.add('waitUntilElementInDOM', (actionToWaitOn: () => Cypress.Chainable) =>
  cy.waitUntil(() =>
    actionToWaitOn()
      .should('have.length.gte', 0)
      .then((element) => !!element.length),
  ),
);

Cypress.Commands.add('clearServiceWorkers', () => {
  // Fix for stuck visit even though page is loaded in cypress
  if (window.navigator && navigator.serviceWorker) {
    const registrationPromise = window.navigator.serviceWorker.getRegistrations().then((registrations) =>
      registrations.forEach((registration) => {
        registration.unregister();
      }),
    );
    return cy.wrap(registrationPromise);
  }
});

Cypress.Commands.add('addToCart', (id = 1072, quantity: number = 1) => {
  cy.request('POST', 'http://localhost:8181/plentysystems/doAddCartItem', { productId: id, quantity: quantity });
});

Cypress.Commands.add('visitSmoke', () => {
  cy.visitAndHydrate('/smoke-e2e');
});

Cypress.Commands.add('visitAndHydrate', (url, options) => {
  cy.clearServiceWorkers();
  cy.visit(url, options);
  // Wait until app is hydrated
  cy.get('body.hydrated');
});

Cypress.Commands.add('isScrolledTo', { prevSubject: true }, (element) => {
  cy.get(element).should(($el) => {
    const bottom = Cypress.config('viewportHeight');
    const rect = $el[0].getBoundingClientRect();

    expect(rect.top).not.to.be.greaterThan(bottom, `Expected element not to be below the visible scrolled area`);
  });
});

// Used to keep the reference to the popup window
const state = {
  popup: null as Window | null,
  originalOpen: null as ((url?: (string | URL), target?: string, features?: string) => (WindowProxy | null)) | null,
};

/**
 * Intercepts calls to window.open() to keep a reference to the new window
 */
Cypress.Commands.add('capturePopup', () => {
  cy.window().then((win) => {
    const maybeStub = win.open as Partial<sinon.SinonStub>;

    if (typeof maybeStub.restore !== 'function') {
      const originalOpen = win.open;

      cy.stub(win, 'open').callsFake((...args) => {
        const popup = originalOpen(...args);
        if (popup) {
          state.popup = popup;
        }
        return popup;
      });
    }
  });
});


/**
 * Returns an iframe content
 */
// @ts-ignore
Cypress.Commands.add('firstIFrame', { prevSubject: 'element' }, $iframe => {
  return new Cypress.Promise(resolve => {
    $iframe.ready(function () {
      resolve($iframe.contents().find('body'));
    });
  });
});

/**
 * Returns a wrapped body of a captured popup
 */
Cypress.Commands.add('popup', (): any => {
  if (state.popup) {
    const popup = Cypress.$(state.popup.document);
    return cy.wrap(popup.contents().find('body'));
  } else {
    throw new Error('No popup window captured. Make sure to call `cy.capturePopup()` before using `cy.popup()`.');
  }
});

Cypress.Commands.add('resetPopupStub', () => {
  cy.window().then((win) => {
    const openStub = win.open as Partial<sinon.SinonStub>;
    if (typeof openStub.restore === 'function') {
      openStub.restore();
    }
  });
});


Cypress.Commands.add('paypalFlow', (email, password) => {
  cy.intercept('/plentysystems/doCreatePayPalOrder').as('doCreatePayPalOrder');

  // Enable popup capture
  cy.capturePopup()
  // Click on the PayPal button inside PayPal's iframe
  cy.get('iframe').firstIFrame().find('div[data-funding-source="paypal"]').realClick()
  cy.wait('@doCreatePayPalOrder');
  cy.wait(4000);
  cy.popup().find('input#email').clear().type(email);
  cy.popup().find('button:visible').first().click().wait(1000);
  cy.popup().find('input#password').clear().type(password);
  cy.popup().find('button#btnLogin').click();
  cy.wait(7000);
  cy.popup().find('button[data-id="payment-submit-btn"]').should('exist').click({ force: true });
})
