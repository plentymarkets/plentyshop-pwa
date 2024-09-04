const ignoreErrors = [
  'zoid',
  'paypal_js_sdk_v5_unhandled_exception',
  'Cannot read properties of undefined (reading \'clickUrl\')'
];

Cypress.on("window:before:load", win => {
  cy.stub(win.console, "error").callsFake(msg => {
    throw new Error(msg)
  })
});

Cypress.on('uncaught:exception', (err, runnable) => {
  if (ignoreErrors.some(ignore => err.message.includes(ignore))) {
    return false;
  }

  console.error('Uncaught exception', err);
  throw err;
});