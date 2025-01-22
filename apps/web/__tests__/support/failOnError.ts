const ignoreErrors = [
  'zoid',
  'paypal',
  'turnstile',
];

Cypress.on("window:before:load", (win) => {
  cy.stub(win.console, "error").callsFake((msg) => {
    throw new Error(msg)
  })
});

Cypress.on('uncaught:exception', (err) => {
  if (ignoreErrors.some((ignore) => err.message.includes(ignore) || err.stack?.includes(ignore))) {
    return false;
  }

  console.error('Uncaught exception', err);
  throw err;
});