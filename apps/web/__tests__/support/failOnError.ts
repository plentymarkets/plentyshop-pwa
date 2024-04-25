Cypress.on("window:before:load", win => {
  cy.stub(win.console, "error").callsFake(msg => {
    throw new Error(msg)
  })
});

Cypress.on('uncaught:exception', (err, runnable) => {
  // return false to prevent the error from failing this test
  if (err.message.includes('zoid')) {
    return false;
  }
  // If it's not a zoid error, you might still want to see it in the console
  console.error('Uncaught exception', err);
  // Throw error further if it's not related to zoid
  throw err;
});