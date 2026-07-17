import 'cypress-wait-until';
import 'cypress-iframe';
import type { DoAddItemParams, BasketItemOrderParamsProperty } from '@plentymarkets/shop-api';

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
      addToCart(
        id?: number,
        quantity?: number,
        basketItemOrderParam?: BasketItemOrderParamsProperty[],
      ): Cypress.Chainable;
      capturePopup(): Cypress.Chainable;
      popup(): Cypress.Chainable;
      paypalFlow(email: string, password: string, isReadonlyFlow: boolean): Cypress.Chainable;
      firstIFrame(): Cypress.Chainable;
      resetPopupStub(): Cypress.Chainable;
      setConfig(config: Record<string, unknown>): Chainable<void>;
      clearConfig(): Chainable<void>;
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

Cypress.Commands.add(
  'addToCart',
  (id: number = 1072, quantity: number = 1, basketItemOrderParams?: BasketItemOrderParamsProperty[]) => {
    const payload: DoAddItemParams = {
      productId: id,
      quantity,
      basketItemOrderParams,
    };

    const configID = Cypress.env('CONFIG_ID') ?? '';

    cy.request({
      method: 'POST',
      url: 'http://localhost:8181/plentysystems/doAddCartItem',
      headers: {
        'x-config-id': configID,
      },
      body: payload,
    });
  },
);

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
  iframeObserver: null as MutationObserver | null,
};

/**
 * Patches window.open on a given window to capture popup references.
 */
function patchWindowOpen(targetWin: Window) {
  try {
    const originalOpen = targetWin.open.bind(targetWin);
    targetWin.open = function (...args: Parameters<typeof window.open>) {
      const popup = originalOpen(...args);
      if (popup) {
        state.popup = popup;
      }
      return popup;
    };
  } catch {
    // cross-origin iframe – cannot patch
  }
}

/**
 * Patches window.open on all existing iframes' contentWindows.
 */
function patchAllIframes(doc: Document) {
  const iframes = doc.querySelectorAll('iframe');
  iframes.forEach((iframe) => {
    try {
      if (iframe.contentWindow) {
        patchWindowOpen(iframe.contentWindow);
      }
    } catch {
      // cross-origin iframe – skip
    }
  });
}

/**
 * Intercepts calls to window.open() to keep a reference to the new window.
 * Also patches iframes (including dynamically added ones) to capture popups
 * opened from within them (e.g. PayPal SDK).
 */
Cypress.Commands.add('capturePopup', () => {
  cy.window().then((win) => {
    state.popup = null;

    // Stub main window.open
    const maybeStub = win.open as Partial<sinon.SinonStub>;
    if (typeof maybeStub.restore !== 'function') {
      const originalOpen = win.open.bind(win);

      cy.stub(win, 'open').callsFake((...args: Parameters<typeof window.open>) => {
        const popup = originalOpen(...args);
        if (popup) {
          state.popup = popup;
        }
        return popup;
      });
    }

    patchAllIframes(win.document);

    // Watch for new iframes being added to the DOM and patch them too
    if (state.iframeObserver) {
      state.iframeObserver.disconnect();
    }
    state.iframeObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLIFrameElement) {
            node.addEventListener('load', () => {
              try {
                if (node.contentWindow) patchWindowOpen(node.contentWindow);
              } catch {
                /* cross-origin */
              }
            });
            try {
              if (node.contentWindow) patchWindowOpen(node.contentWindow);
            } catch {
              /* cross-origin */
            }
          }

          if (node instanceof HTMLElement) {
            node.querySelectorAll?.('iframe').forEach((iframe) => {
              // eslint-disable-next-line max-nested-callbacks
              iframe.addEventListener('load', () => {
                try {
                  if (iframe.contentWindow) patchWindowOpen(iframe.contentWindow);
                } catch {
                  /* cross-origin */
                }
              });
              try {
                if (iframe.contentWindow) patchWindowOpen(iframe.contentWindow);
              } catch {
                /* cross-origin */
              }
            });
          }
        }
      }
    });
    state.iframeObserver.observe(win.document.body, { childList: true, subtree: true });
  });
});

/**
 * Returns an iframe content
 */
// @ts-expect-error prevSubject is not recognized by Cypress
Cypress.Commands.add('firstIFrame', { prevSubject: 'element' }, ($iframe) => {
  return new Cypress.Promise((resolve) => {
    $iframe.ready(function () {
      resolve($iframe.contents().find('body'));
    });
  });
});

/**
 * Returns a wrapped body of a captured popup
 */
Cypress.Commands.add('popup', (): Cypress.Chainable => {
  return cy
    .waitUntil(
      () => {
        if (state.popup && !state.popup.closed) {
          try {
            return cy.wrap(true);
          } catch {
            return cy.wrap(false);
          }
        }
        return cy.wrap(false);
      },
      {
        timeout: 15_000,
        interval: 500,
        errorMsg: 'No popup window captured. Make sure to call `cy.capturePopup()` before using `cy.popup()`.',
      },
    )
    .then(() => {
      const popup = Cypress.$(state.popup!.document);
      return cy.wrap(popup.contents().find('body'));
    });
});

Cypress.Commands.add('resetPopupStub', () => {
  if (state.iframeObserver) {
    state.iframeObserver.disconnect();
    state.iframeObserver = null;
  }
  state.popup = null;
  cy.window().then((win) => {
    const openStub = win.open as Partial<sinon.SinonStub>;
    if (typeof openStub.restore === 'function') {
      openStub.restore();
    }
  });
});

Cypress.Commands.add('paypalFlow', (email, password, isReadonlyFlow) => {
  cy.intercept('/plentysystems/doCreatePayPalOrder').as('doCreatePayPalOrder');
  cy.intercept('/plentysystems/doPreparePayment').as('doPreparePayment');

  const LOGIN_BTN = isReadonlyFlow ? 'button[data-atomic-wait-task="login_with_password"]' : 'button#btnLogin';
  const PAY_BTN = isReadonlyFlow
    ? 'button[data-atomic-wait-task="select_pay"]'
    : 'button[data-id="payment-submit-btn"]';

  cy.capturePopup();
  cy.waitUntil(
    () =>
      cy
        .get('iframe')
        .firstIFrame()
        .then(($body) => !!$body.find('div[data-funding-source="paypal"]').length),
    { timeout: 15_000, interval: 300, errorMsg: 'PayPal button did not appear in iframe' },
  );
  // Click on the PayPal button inside PayPal's iframe
  cy.get('iframe').firstIFrame().find('div[data-funding-source="paypal"]').realClick();
  cy.wait('@doCreatePayPalOrder');
  cy.wait('@doPreparePayment');
  cy.wait(4000);
  cy.popup().find('input#email').clear().type(email);
  cy.popup().find('button:visible').first().click().wait(1000);
  cy.popup().find('input#password').clear().type(password).wait(1000);
  cy.popup().find(LOGIN_BTN).click();
  cy.wait(7000);
  cy.popup().find(PAY_BTN).should('exist').click({ force: true });
});

Cypress.Commands.add('setConfig', (config: Record<string, unknown>) => {
  cy.setCookie('_e2e_config', JSON.stringify(config));
});

Cypress.Commands.add('clearConfig', () => {
  cy.clearCookie('_e2e_config');
});
