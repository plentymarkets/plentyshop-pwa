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
      visitAndHydrate(url: string, options?: Partial<Cypress.VisitOptions>): Cypress.Chainable | null;
      clearServiceWorkers(): Cypress.Chainable | null;
      isScrolledTo(): Cypress.Chainable;
      addToCart(id?: number, quantity?: number): Cypress.Chainable;
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
